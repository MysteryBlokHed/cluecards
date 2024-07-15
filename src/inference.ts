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
) {
    const hands = emptyHands(players);

    // Handle custom knowns
    for (const known of knowns) {
        if (known.type === 'innocent') {
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

    return hands;
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
): [knowns: Known[], amendments: Suggestion[], hands: PlayerHand[]] {
    console.group('Running inferSingle');

    const newKnowns: Known[] = [];
    // const newAmendments: ResponseAmendment[] = [];
    let newSuggestions = structuredClone(suggestions) as Suggestion[];

    if (!hands) {
        console.log('Creating hands');
        hands = createHands(suggestions, knowns, players, set);
    }

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

        const knownsInclude = (type: CardType, card: number) =>
            knowns.some(known => known.cardType === type && known.card === card);

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
            console.log('Skipping suggestion', i, 'of', suggestions.length - 1);
            continue;
        }

        console.group('Suggestion', i, 'of', suggestions.length - 1);

        for (const [j, response] of suggestion.responses.entries()) {
            console.group('Response', j, 'of', suggestion.responses.length - 1);

            // Ensure that any cards we know the type of are already in the known list
            if (response.cardType >= 0) {
                console.log('Found exact card');
                if (
                    !knowns.some(
                        known =>
                            known.cardType === response.cardType && known.card === response.card,
                    )
                ) {
                    console.log('Card was not in known list--adding to newKnowns');
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

            const missingCards = suggestion.cards
                .map((card, type) => packCard(type, card))
                .filter(card => hands[response.player].missing.has(card))
                .map(unpackCard);

            // If two cards are missing from this player's hand, then we know for ceratin what this card is
            if (missingCards.length === 2) {
                console.log('Length checks out--amending suggestion');
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

                console.log("We don't know about this yet--updating knowns");

                // Update knowns
                newKnowns.push({
                    type: 'innocent',
                    cardType: shownType,
                    card: shownCard,
                    player: response.player,
                    source: RevealMethod.InferSuggestion,
                });

                console.log('Suggestions modified and newKnowns updated');
                console.groupEnd();
            }
        }

        console.groupEnd();
    }

    // If new inferences were made, then re-run this function with the new updates before continuing
    if (newKnowns.length) {
        console.log('This run produced changes--recursing...');

        const [recursiveKnowns, recursiveSuggestions] = inferSingle(
            newSuggestions,
            set,
            players,
            [...knowns, ...newKnowns],
            hands,
        );

        // Try to create hands based on new data
        const newHands = createHands(
            recursiveSuggestions,
            [...knowns, ...newKnowns, ...recursiveKnowns],
            players,
            set,
        );

        console.log('Recrusive call finished, new hands created');

        if (!handsEqual(hands, newHands)) {
            console.log('Hands are not equal--recursing again...');
            const [newestKnowns, newestSuggestions] = inferSingle(
                recursiveSuggestions,
                set,
                players,
                [...knowns, ...newKnowns, ...recursiveKnowns],
                newHands,
            );
            console.log('Recursing done. Applying new knowns and suggestions');

            recursiveKnowns.push(...newestKnowns);
            newSuggestions = newestSuggestions;
        }

        console.groupEnd();
        return [[...newKnowns, ...recursiveKnowns], newSuggestions, newHands];
    }

    // Otherwise, return the empty lists
    console.log('Nothing happened this run. Returning parameters as passed');
    console.groupEnd();
    return [newKnowns, newSuggestions, structuredClone(hands) as PlayerHand[]];
}
