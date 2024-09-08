import { packSet, packCard, unpackCard, packSuggestions } from './cards';
import { CardType, RevealMethod } from './types';
import type { GameSet, Known, KnownInnocent, PlayerHand, Suggestion } from './types';

export function handsEqual(hands1: readonly PlayerHand[], hands2: readonly PlayerHand[]) {
    // Lists should be of the same length in the first place
    if (hands1.length !== hands2.length) return false;
    for (const [i, hand] of hands1.entries()) {
        const hand2 = hands2[i];

        // Sets should be of same size
        if (hand.has.size !== hand2.has.size) return false;
        if (hand.missing.size !== hand2.missing.size) return false;
        if (hand.maybe.size !== hand2.maybe.size) return false;

        // Sets should contain all the same elements (therefore there should be no difference)
        if (hand.has.symmetricDifference(hand2.has).size !== 0) return false;
        if (hand.missing.symmetricDifference(hand2.missing).size !== 0) return false;
        if (hand.maybe.symmetricDifference(hand2.maybe).size !== 0) return false;
    }

    return true;
}

export function handsHasToString(hands: readonly PlayerHand[]) {
    return hands
        .map(hand =>
            Array.from(hand.has)
                .sort((a, b) => a - b)
                .join(','),
        )
        .join('|');
}

export function emptyHands(players: number) {
    const hands: PlayerHand[] = [];
    for (let i = 0; i < players; i++) {
        hands.push({ has: new Set(), missing: new Set(), maybe: new Set(), maybeGroups: {} });
    }
    return hands;
}

/**
 * Determine guilty cards from hands.
 * @returns Guilty cards in a format similar to {@link Suggestion} cards.
 */
function guiltyFromHands(hands: readonly PlayerHand[]) {
    // Get cards all players are missing
    const allMissing = hands
        .map(hand => hand.missing)
        .reduce((allMissing, missing) => allMissing.intersection(missing));

    const guilty: [suspect: number | null, weapon: number | null, room: number | null] = [
        null,
        null,
        null,
    ];

    // Find cards that all players are missing
    for (const packed of allMissing) {
        const [type, card] = unpackCard(packed);
        guilty[type as 0 | 1 | 2] = card;
    }

    return guilty;
}

/**
 * Internal recursive function for {@link createHands}.
 */
function _createHands(
    playerCardCounts: readonly number[],
    set: GameSet,
    hands: PlayerHand[],
    packedSet: readonly number[],
    guiltyIsKnown: [suspect: boolean, weapon: boolean, room: boolean],
): PlayerHand[] {
    const lastHands = structuredClone(hands);
    const totalCards = packedSet.length;

    // Hand-by-hand inferences
    for (const [i, hand] of hands.entries()) {
        // =========================
        // If we know all but one card in a player's hand, and there exists a "maybe group"
        // which has no intersection with the "has" set,
        // then the final card must be one of the cards in the "maybe group"
        // =========================
        if (hand.has.size === playerCardCounts[i] - 1) {
            const eligibleGroups = Object.entries(hand.maybeGroups).filter(
                ([, cards]) => cards.intersection(hand.has).size === 0,
            );

            if (eligibleGroups.length) {
                const [, group] = eligibleGroups[0];
                for (const card of packedSet) {
                    if (!group.has(card) && !hand.has.has(card)) hand.missing.add(card);
                }
            }
        }

        // =========================
        // Actions based on card count
        // =========================
        if (hand.has.size >= playerCardCounts[i]) {
            // If a player has all the cards allowed in their hand, check everything else off
            for (const card of packedSet) {
                if (!hand.has.has(card)) hand.missing.add(card);
            }
        } else if (hand.missing.size >= totalCards - playerCardCounts[i]) {
            // If a player has every card crossed off except for the # of cards in their hand, they must have those cards
            for (const card of packedSet) {
                if (!hand.missing.has(card)) hand.has.add(card);
            }
        }

        // =========================
        // If a player is confirmed to have a card, mark it as missing for everyone else
        // =========================
        for (const card of hand.has) {
            hands
                // All other hands
                .filter(otherHand => otherHand !== hand)
                // Mark card missing
                .forEach(otherHand => otherHand.missing.add(card));
        }

        // =========================
        // Make sure that no player has cards appearing in more than one list
        // =========================
        if (hand.has.intersection(hand.missing).size !== 0) {
            console.error('Player', i, hand, hand.has.intersection(hand.missing));
            throw new Error('A player is marked as both having and not having a card');
        }

        const hasAndMaybe = hand.has.intersection(hand.maybe);
        const missingAndMaybe = hand.missing.intersection(hand.maybe);
        const toRemove = hasAndMaybe.union(missingAndMaybe);
        toRemove.forEach(card => hand.maybe.delete(card));

        // =========================
        // Update maybeGroups
        // =========================
        const emptied: string[] = [];
        for (const [key, maybeGroup] of Object.entries(hand.maybeGroups)) {
            // Remove any cards from maybeGroups that are marked missing
            maybeGroup.intersection(hand.missing).forEach(card => maybeGroup.delete(card));

            // If the group has one card, mark it as "has"
            // !!! This should entirely replace the original infer function !!!
            if (maybeGroup.size === 1) {
                const finalCard = maybeGroup.values().next().value!;
                hand.has.add(finalCard);
                maybeGroup.delete(finalCard);
            }

            // If the group is empty, mark it for deletion
            if (maybeGroup.size === 0) emptied.push(key);
        }

        emptied.forEach(key => delete hand.maybeGroups[key as unknown as number]);
    }

    // If all but one player has a card marked missing, and the guilty card for that category is known,
    // that one player must have the card
    if (guiltyIsKnown[0] || guiltyIsKnown[1] || guiltyIsKnown[2]) {
        /** A mapping of packed cards to the players who do _not_ have it */
        const missingMap: Record<number, number[]> = {};
        for (const [player, hand] of hands.entries()) {
            for (const card of hand.missing) {
                missingMap[card] ||= [];
                missingMap[card].push(player);
            }
        }

        for (const [card, missingPlayers] of Object.entries(missingMap)) {
            if (missingPlayers.length === hands.length - 1) {
                // Ignore if the guilty card is not known for this category
                const [type] = unpackCard(parseInt(card));
                if (!guiltyIsKnown[type as 0 | 1 | 2]) continue;

                // Find the player that does not have the card
                const player = Array.from(new Array(hands.length).keys()).find(
                    player => !missingPlayers.includes(player),
                )!;
                // Mark them as having the card
                hands[player].has.add(parseInt(card));
            }
        }
    }

    // Recurse if the hands changed
    if (!handsEqual(hands, lastHands)) {
        hands = _createHands(playerCardCounts, set, hands, packedSet, guiltyIsKnown);
    }

    return hands;
}

/**
 * Create player hand info based on suggestions and other inference.
 * Related to {@link infer} and should likely only be called from there.
 * @param suggestions The suggestions to use
 * @param knowns Any knowns to take into consideration (that are _not_ derived from suggestions)
 * @param hands The hands to update
 * @param firstIsSelf Whether the player at index 0 is the user
 */
export function createHands(
    suggestions: readonly Suggestion[],
    knowns: readonly Known[],
    players: number,
    playerCardCounts: readonly number[],
    set: GameSet,
    firstIsSelf: boolean,
): [hands: PlayerHand[], innocents: Set<number>] {
    const packedSet = packSet(set);

    const guiltyKnowns = knowns.filter(known => known.type === 'guilty');
    const guiltySuspect = guiltyKnowns.find(known => known.cardType === CardType.Suspect);
    const guiltyWeapon = guiltyKnowns.find(known => known.cardType === CardType.Weapon);
    const guiltyRoom = guiltyKnowns.find(known => known.cardType === CardType.Room);

    const guiltyIsKnown: [boolean, boolean, boolean] = [
        !!guiltySuspect,
        !!guiltyWeapon,
        !!guiltyRoom,
    ];

    const startingHands = emptyHands(players);

    // =======================
    // Non-recursive inference
    // =======================
    // Handle custom knowns
    for (const known of knowns) {
        if (known.type === 'innocent') {
            if (known.player < 0) continue;
            startingHands[known.player].has.add(packCard(known.cardType, known.card));
        } else {
            for (const hand of startingHands) {
                hand.missing.add(packCard(known.cardType, known.card));
            }
        }
    }

    // For the user themself, if any card is not explicitly known as innocent, they must not have it
    if (firstIsSelf) {
        // Mark as missing if they are not contained in the hand
        for (const card of packedSet) {
            if (!startingHands[0].has.has(card)) startingHands[0].missing.add(card);
        }
    }

    // Handle suggestions
    for (const [i, suggestion] of suggestions.entries()) {
        // Find (packed) cards used for suggestion
        const suggestionCards = packSuggestions(suggestion.cards);

        for (const response of suggestion.responses) {
            switch (response.cardType) {
                // A player specifically _did not_ show a card
                case CardType.Nothing:
                    suggestionCards.forEach(card =>
                        startingHands![response.player].missing.add(card),
                    );
                    break;
                // A player showed a card, but we do not know which
                case CardType.Unknown:
                    startingHands[response.player].maybeGroups[i] ||= new Set();
                    suggestionCards.forEach(card => {
                        startingHands![response.player].maybe.add(card);
                        startingHands![response.player].maybeGroups[i].add(card);
                    });
                    break;
                // A player showed a card we know the type of
                default:
                    startingHands[response.player].has.add(
                        packCard(response.cardType, response.card),
                    );
                    break;
            }
        }
    }

    // ==============================
    // End of non-recursive inference
    // ==============================

    const hands = _createHands(playerCardCounts, set, startingHands, packedSet, guiltyIsKnown);

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
export function infer(
    suggestions: Suggestion[],
    set: GameSet,
    players: number,
    playerCardCounts: readonly number[],
    firstIsSelf: boolean,
    knowns: readonly Known[] = [],
    hands?: readonly PlayerHand[],
    innocents?: Set<number>,
): [knowns: Known[], amendments: Suggestion[], hands: PlayerHand[], innocents: Set<number>] {
    const newKnowns: Known[] = [];

    if (!hands || !innocents) {
        [hands, innocents] = createHands(
            suggestions,
            knowns,
            players,
            playerCardCounts,
            set,
            firstIsSelf,
        );
    }

    const knownsInclude = (
        type: CardType,
        card: number,
        knownsList = knowns,
        ignoreNegativePlayer = false,
    ) =>
        ignoreNegativePlayer
            ? knownsList.some(
                  known =>
                      known.cardType === type &&
                      known.card === card &&
                      (known.type === 'innocent' ? known.player > -1 : true),
              )
            : knownsList.some(known => known.cardType === type && known.card === card);

    // Figure out guilty knowns, if possible
    {
        const knownInnocent = knowns.filter(known => known.type === 'innocent');
        const knownGuilty = knowns.filter(known => known.type === 'guilty');

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

        const guiltyHands = guiltyFromHands(hands);

        const guiltySuspect =
            unknownSuspects.length === 1 ? unknownSuspects[0] : guiltyHands[CardType.Suspect];
        const guiltyWeapon =
            unknownWeapons.length === 1 ? unknownWeapons[0] : guiltyHands[CardType.Weapon];
        const guiltyRoom = unknownRooms.length === 1 ? unknownRooms[0] : guiltyHands[CardType.Room];

        if (guiltySuspect != null && !knownsInclude(CardType.Suspect, guiltySuspect, knownGuilty)) {
            newKnowns.push({
                type: 'guilty',
                cardType: CardType.Suspect,
                card: guiltySuspect,
            });
        }
        if (guiltyWeapon != null && !knownsInclude(CardType.Weapon, guiltyWeapon, knownGuilty)) {
            newKnowns.push({
                type: 'guilty',
                cardType: CardType.Weapon,
                card: guiltyWeapon,
            });
        }
        if (guiltyRoom != null && !knownsInclude(CardType.Room, guiltyRoom, knownGuilty)) {
            newKnowns.push({
                type: 'guilty',
                cardType: CardType.Room,
                card: guiltyRoom,
            });
        }
    }

    for (const [i, suggestion] of suggestions.entries()) {
        if (!suggestion.responses.length) {
            continue;
        }

        const packedSuggestions = suggestion.cards.map((card, type) => packCard(type, card));
        const packedSuggestionsSet = new Set(packedSuggestions);

        for (const [j, response] of suggestion.responses.entries()) {
            // Ensure that any cards we know the type of are already in the known list
            if (response.cardType >= 0) {
                if (!knownsInclude(response.cardType, response.card, knowns, true)) {
                    newKnowns.push({
                        ...response,
                        type: 'innocent',
                        source: RevealMethod.Direct,
                    });
                }
                continue;
            }

            // Nothing was shown--nothing to infer
            if (response.cardType === CardType.Nothing) {
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
                suggestions[i].responses[j] = {
                    ...response,
                    cardType: shownType,
                    card: shownCard,
                    source: RevealMethod.InferSuggestion,
                };

                // Make sure that this is not already known
                if (
                    knowns.some(known => known.cardType === shownType && known.card === shownCard)
                ) {
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

        /** A set of cards involved in the suggestion that all responding players are missing. */
        const collectiveMissing = unknownResponses
            // Get players involved
            .map(response => response.player)
            // Get their sets of missing cards
            .map(player => hands[player].missing)
            // Figure out which cards *all* players are missing
            .reduce((collective, current) => collective.intersection(current))
            // Figure out which of those are involved in the suggestion
            .intersection(packedSuggestionsSet);

        // Make inferences if there are enough missing cards
        if (3 - respondingPlayers === collectiveMissing.size) {
            // Iterate over the suggested cards (except for the one all players did not have)
            for (const packed of packedSuggestionsSet.difference(collectiveMissing)) {
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
    }

    // If new inferences were made, then re-run this function with the new updates before continuing
    if (newKnowns.length) {
        const [recursiveKnowns] = infer(
            suggestions,
            set,
            players,
            playerCardCounts,
            firstIsSelf,
            [...knowns, ...newKnowns],
            hands,
            innocents,
        );

        // Try to create hands based on new data
        let [newHands, newInnocents] = createHands(
            suggestions,
            [...knowns, ...newKnowns, ...recursiveKnowns],
            players,
            playerCardCounts,
            set,
            firstIsSelf,
        );

        if (!handsEqual(hands, newHands)) {
            const [newestKnowns, , newestHands, newestInnocents] = infer(
                suggestions,
                set,
                players,
                playerCardCounts,
                firstIsSelf,
                [...knowns, ...newKnowns, ...recursiveKnowns],
                newHands,
                newInnocents,
            );

            recursiveKnowns.push(...newestKnowns);
            newHands = newestHands;
            newInnocents = newestInnocents;
        }

        return [[...newKnowns, ...recursiveKnowns], suggestions, newHands, newInnocents];
    }

    // Otherwise, return the empty lists
    return [newKnowns, suggestions, structuredClone(hands) as PlayerHand[], innocents];
}

type Triplet = `${number}|${number}|${number}`;

/** Used when probabilities run for too long */
class TimeoutError extends Error {}

function _probabilities(
    suggestions: readonly Suggestion[],
    set: GameSet,
    hands: readonly PlayerHand[],
    playerCardCounts: readonly number[],
    firstIsSelf: boolean,
    knowns: readonly Known[],
    packedSet: readonly number[],
    packOffset: number,
    seen: Set<string>,
    limit: number,
    occurrences: Record<Triplet, number>,
    startTime: number,
) {
    const [suspect, weapon, room] = guiltyFromHands(hands);

    // Return if we know suspects, weapons, and rooms
    if (suspect != null && weapon != null && room != null) {
        // Do not count if this particular arrangement of cards has already been seen
        const asString = handsHasToString(hands);
        if (seen.has(asString)) return {};
        seen.add(asString);

        const key = `${suspect}|${weapon}|${room}` as const;
        occurrences[key] ??= 0;
        occurrences[key]++;
        return occurrences;
    }

    for (let packedIndex = packOffset; packedIndex < packedSet.length; packedIndex++) {
        const packed = packedSet[packedIndex];

        for (let player = 0; player < hands.length; player++) {
            // Ignore if this card already has a known state
            if (hands[player].has.has(packed) || hands[player].missing.has(packed)) continue;

            const [type, card] = unpackCard(packed);

            // Add new known for this card
            const known: KnownInnocent = {
                type: 'innocent',
                cardType: type,
                card,
                player,
                source: RevealMethod.InferSuggestion,
            };

            // Run inference
            try {
                const [newKnowns, newSuggestions, newHands] = infer(
                    structuredClone(suggestions) as Suggestion[],
                    set,
                    hands.length,
                    playerCardCounts,
                    firstIsSelf,
                    [...knowns, known],
                );

                // Since `occurrences` is directly modified, the return value can be ignored
                _probabilities(
                    newSuggestions,
                    set,
                    newHands,
                    playerCardCounts,
                    firstIsSelf,
                    [...knowns, known, ...newKnowns],
                    packedSet,
                    packedIndex,
                    seen,
                    limit,
                    occurrences,
                    startTime,
                );
            } catch (e) {
                if (e instanceof TimeoutError) throw e;
                console.warn('Error during probabilities infer:', e);
            }

            if (performance.now() - startTime >= limit) {
                throw new TimeoutError('Run too long, stopping...');
            }
        }
    }

    return occurrences;
}

export function probabilities(
    suggestions: readonly Suggestion[],
    set: GameSet,
    hands: readonly PlayerHand[],
    playerCardCounts: readonly number[],
    firstIsSelf: boolean,
    knowns: readonly Known[],
    limit = 10_000,
) {
    const packedSet = packSet(set);

    return _probabilities(
        suggestions,
        set,
        hands,
        playerCardCounts,
        firstIsSelf,
        knowns,
        packedSet,
        0,
        new Set(),
        limit,
        {},
        performance.now(),
    );
}
