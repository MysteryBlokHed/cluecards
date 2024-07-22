import { packCard, unpackCard } from './cards';
import { CardType, RevealMethod } from './types';
import type { GameSet, Known, PlayerHand, Suggestion } from './types';

export function handsEqual(hands1: readonly PlayerHand[], hands2: readonly PlayerHand[]) {
    // Lists should be of the same length in the first place
    if (hands1.length !== hands2.length) return false;
    for (const [i, hand] of hands1.entries()) {
        // Sets should be of same size
        if (hand.has.size !== hands2[i].has.size) return false;
        if (hand.missing.size !== hands2[i].missing.size) return false;
        if (hand.maybe.size !== hands2[i].maybe.size) return false;

        // Sets should contain all the same elements (therefore there should be no difference)
        if (hand.has.symmetricDifference(hands2[i].has).size !== 0) return false;
        if (hand.missing.symmetricDifference(hands2[i].missing).size !== 0) return false;
        if (hand.maybe.symmetricDifference(hands2[i].maybe).size !== 0) return false;
    }

    return true;
}

export function emptyHands(players: number) {
    const hands: PlayerHand[] = [];
    for (let i = 0; i < players; i++) {
        hands.push({ has: new Set(), missing: new Set(), maybe: new Set() });
    }
    return hands;
}

/**
 * Create player hand info based on suggestions.
 * @param suggestions The suggestions to use
 * @param knowns Any knowns to take into consideration (that are _not_ derived from suggestions)
 * @param hands The hands to update
 * @param firstIsSelf Whether the player at index 0 is the user
 */
export function createHands(
    suggestions: readonly Suggestion[],
    knowns: readonly Known[],
    players: number,
    set: GameSet,
    firstIsSelf = true,
): [hands: PlayerHand[], innocents: Set<number>] {
    const hands = emptyHands(players);

    // Handle custom knowns
    for (const known of knowns) {
        if (known.type === 'innocent') {
            if (known.player < 0) continue;
            hands[known.player].has.add(packCard(known.cardType, known.card));
        } else {
            for (const hand of hands) {
                hand.missing.add(packCard(known.cardType, known.card));
            }
        }
    }

    // For the user themself, if any card is not explicitly known as innocent, they must not have it
    if (firstIsSelf) {
        // Get amount of suspects/weapons/rooms
        const suspects = set.suspects.length;
        const weapons = set.weapons.length;
        const rooms = set.rooms.length;

        // Mark as missing if they are not contained in the hand
        for (let card = 0; card < suspects; card++) {
            const packed = packCard(CardType.Suspect, card);
            if (!hands[0].has.has(packed)) hands[0].missing.add(packed);
        }
        for (let card = 0; card < weapons; card++) {
            const packed = packCard(CardType.Weapon, card);
            if (!hands[0].has.has(packed)) hands[0].missing.add(packed);
        }
        for (let card = 0; card < rooms; card++) {
            const packed = packCard(CardType.Room, card);
            if (!hands[0].has.has(packed)) hands[0].missing.add(packed);
        }
    }

    // Handle suggestions
    for (const suggestion of suggestions) {
        // Find (packed) cards used for suggestion
        const suggestionCards = suggestion.cards.map((card, type: CardType) =>
            packCard(type, card),
        );

        for (const response of suggestion.responses) {
            switch (response.cardType) {
                // A player specifically _did not_ show a card
                case CardType.Nothing:
                    suggestionCards.forEach(card => hands[response.player].missing.add(card));
                    break;
                // A player showed a card, but we do not know which
                case CardType.Unknown:
                    suggestionCards.forEach(card => hands[response.player].maybe.add(card));
                    break;
                // A player showed a card we know the type of
                default:
                    hands[response.player].has.add(packCard(response.cardType, response.card));
                    break;
            }
        }
    }

    // Make sure that no player has cards appearing in more than one list
    for (const hand of hands) {
        if (hand.has.intersection(hand.missing).size !== 0)
            throw new Error('A player is marked as both having and not having a card');

        /** Cards in {@link hand.has} and {@link hand.maybe} */
        const hasAndMaybe = hand.has.intersection(hand.maybe);
        /** Cards in {@link hand.missing} and {@link hand.maybe} */
        const missingAndMaybe = hand.missing.intersection(hand.maybe);
        const toRemove = hasAndMaybe.union(missingAndMaybe);

        toRemove.forEach(card => hand.maybe.delete(card));
    }

    // If a player is confirmed to have a card, mark it as missing for everyone else
    for (const hand of hands) {
        for (const card of hand.has) {
            hands
                // All other hands
                .filter(otherHand => otherHand !== hand)
                // Mark card missing
                .forEach(otherHand => otherHand.missing.add(card));
        }
    }

    /** All innocent cards, derived from {@link knowns}. */
    const allKnownInnocents = new Set(
        knowns
            .filter(known => known.type === 'innocent')
            .map(known => packCard(known.cardType, known.card)),
    );

    /** All innocent cards, derived from {@link hands}. */
    const allHandInnocents = hands
        .map(hand => hand.has)
        .reduce((all, current) => all.union(current));

    /** All innocent cards. */
    const allInnocents = allKnownInnocents.union(allHandInnocents);

    return [hands, allInnocents];
}

/**
 * Try to make inferences based on the history of suggestions.
 * @param suggestions The list of suggestions
 * @param set The current game set
 * @param players The amount of players
 * @param knowns Already-known data
 * @param hands Hands generated from {@link createHands}.
 * This should not typically be passed by an outside caller (it is used for recursion)
 */
export function inferSingle(
    suggestions: readonly Suggestion[],
    set: GameSet,
    players: number,
    knowns: readonly Known[] = [],
    hands?: readonly PlayerHand[],
    innocents?: Set<number>,
): [knowns: Known[], amendments: Suggestion[], hands: PlayerHand[], innocents: Set<number>] {
    console.group('Running inferSingle');

    const newKnowns: Known[] = [];
    // const newAmendments: ResponseAmendment[] = [];
    let newSuggestions = structuredClone(suggestions) as Suggestion[];

    if (!hands || !innocents) {
        [hands, innocents] = createHands(suggestions, knowns, players, set);
    }

    const knownsInclude = (type: CardType, card: number, ignoreNegativePlayer = false) =>
        ignoreNegativePlayer
            ? knowns.some(
                  known =>
                      known.cardType === type &&
                      known.card === card &&
                      (known.type === 'innocent' ? known.player > -1 : true),
              )
            : knowns.some(known => known.cardType === type && known.card === card);

    // Figure out guilty knowns, if possible
    {
        const knownInnocent = knowns.filter(known => known.type === 'innocent');
        const innocentSuspects = knownInnocent
            .filter(known => known.cardType === CardType.Suspect)
            .map(known => known.card);
        const innocentWeapons = knownInnocent
            .filter(known => known.cardType === CardType.Weapon)
            .map(known => known.card);
        const innocentRooms = knownInnocent
            .filter(known => known.cardType === CardType.Room)
            .map(known => known.card);

        const unknownSuspects = set.suspects
            .map((_, card) => card)
            .filter(card => !innocentSuspects.includes(card));
        const unknownWeapons = set.weapons
            .map((_, card) => card)
            .filter(card => !innocentWeapons.includes(card));
        const unknownRooms = set.rooms
            .map((_, card) => card)
            .filter(card => !innocentRooms.includes(card));

        if (unknownSuspects.length === 1 && !knownsInclude(CardType.Suspect, unknownSuspects[0])) {
            newKnowns.push({
                type: 'guilty',
                cardType: CardType.Suspect,
                card: unknownSuspects[0],
            });
        }
        if (unknownWeapons.length === 1 && !knownsInclude(CardType.Weapon, unknownWeapons[0])) {
            newKnowns.push({
                type: 'guilty',
                cardType: CardType.Weapon,
                card: unknownWeapons[0],
            });
        }
        if (unknownRooms.length === 1 && !knownsInclude(CardType.Room, unknownRooms[0])) {
            newKnowns.push({
                type: 'guilty',
                cardType: CardType.Room,
                card: unknownRooms[0],
            });
        }
    }

    for (const [i, suggestion] of suggestions.entries()) {
        if (!suggestion.responses.length) {
            continue;
        }

        const packedSuggestions = suggestion.cards.map((card, type) => packCard(type, card));

        for (const [j, response] of suggestion.responses.entries()) {
            // Ensure that any cards we know the type of are already in the known list
            if (response.cardType >= 0) {
                if (!knownsInclude(response.cardType, response.card, true)) {
                    newKnowns.push({
                        ...response,
                        type: 'innocent',
                        source: RevealMethod.Direct,
                    });
                }
                console.groupEnd();
                continue;
            }

            // Nothing was shown--nothing to infer
            if (response.cardType === CardType.Nothing) {
                console.groupEnd();
                continue;
            }

            const missingCards = packedSuggestions
                .filter(card => hands[response.player].missing.has(card))
                .map(unpackCard);

            // If two cards are missing from this player's hand, then we know for ceratin what this card is
            if (missingCards.length === 2) {
                // Figure out which card type must have been shown
                const shownType = ([0, 1, 2] as const).filter(
                    type => !missingCards.some(card => card[0] === type),
                )[0];

                const shownCard = suggestion.cards[shownType];

                // Amend suggestion response
                newSuggestions[i].responses[j] = {
                    ...response,
                    cardType: shownType,
                    card: shownCard,
                    source: RevealMethod.InferSuggestion,
                };

                // Make sure that this is not already known
                if (
                    knowns.some(known => known.cardType === shownType && known.card === shownCard)
                ) {
                    console.groupEnd();
                    continue;
                }

                // Update knowns
                newKnowns.push({
                    type: 'innocent',
                    cardType: shownType,
                    card: shownCard,
                    player: response.player,
                    source: RevealMethod.InferSuggestion,
                });
            }
        }

        /*
         * ==========================================
         * For clue variations where multiple players
         * show cards at once
         * ==========================================
         */
        const unknownResponses = suggestion.responses.filter(
            response => response.cardType === CardType.Unknown,
        );

        // If there are one or no responses then it will have been handled above
        if (unknownResponses.length <= 1) continue;

        /** The number of responding players */
        const respondingPlayers = new Set(unknownResponses.filter(response => response.player))
            .size;

        /**
         * A set of cards that all responding players are missing,
         * including cards not involved in the suggestion.
         */
        const allCollectiveMissing = unknownResponses
            // Get players involved
            .map(response => response.player)
            // Get their sets of missing cards
            .map(player => hands[player].missing)
            // Figure out which cards *all* players are missing
            .reduce((collective, current) => collective.intersection(current));

        /** A set of cards involved in the suggestion that all responding players are missing. */
        const collectiveMissing = new Set(
            Array.from(allCollectiveMissing).filter(card => packedSuggestions.includes(card)),
        );

        // Make inferences if there are enough missing cards
        if (3 - respondingPlayers === collectiveMissing.size) {
            // Iterate over the suggested cards (except for the one all players did not have)
            for (const packed of packedSuggestions.filter(card => !collectiveMissing.has(card))) {
                const [cardType, card] = unpackCard(packed);

                if (!knownsInclude(cardType, card)) {
                    newKnowns.push({
                        type: 'innocent',
                        cardType,
                        card,
                        player: -1,
                        source: RevealMethod.InferSuggestion,
                    });
                }
            }
        }

        console.groupEnd();
    }

    // If new inferences were made, then re-run this function with the new updates before continuing
    if (newKnowns.length) {
        const [recursiveKnowns, recursiveSuggestions] = inferSingle(
            newSuggestions,
            set,
            players,
            [...knowns, ...newKnowns],
            hands,
            innocents,
        );

        // Try to create hands based on new data
        let [newHands, newInnocents] = createHands(
            recursiveSuggestions,
            [...knowns, ...newKnowns, ...recursiveKnowns],
            players,
            set,
        );

        if (!handsEqual(hands, newHands)) {
            const [newestKnowns, newestSuggestions, newestHands, newestInnocents] = inferSingle(
                recursiveSuggestions,
                set,
                players,
                [...knowns, ...newKnowns, ...recursiveKnowns],
                newHands,
                newInnocents,
            );

            recursiveKnowns.push(...newestKnowns);
            newSuggestions = newestSuggestions;
            newHands = newestHands;
            newInnocents = newestInnocents;
        }

        console.groupEnd();
        return [[...newKnowns, ...recursiveKnowns], newSuggestions, newHands, newInnocents];
    }

    // Otherwise, return the empty lists
    return [newKnowns, newSuggestions, structuredClone(hands) as PlayerHand[], innocents];
}
