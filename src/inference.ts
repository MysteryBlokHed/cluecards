import { packSet, packCard, unpackCard, packSuggestions, cardTypeToKey } from './cards';
import { CardType, RevealMethod } from './types';
import type { GameSet, Known, KnownInnocent, PlayerHand, Suggestion } from './types';

export function handsEqual(hands1: readonly PlayerHand[], hands2: readonly PlayerHand[]) {
    // Lists should be of the same length in the first place
    if (hands1.length !== hands2.length) return false;
    for (const [i, hand1] of hands1.entries()) {
        const hand2 = hands2[i];

        // Sets should be the same size
        if (hand1.has.size !== hand2.has.size) return false;
        if (hand1.missing.size !== hand2.missing.size) return false;
        if (hand1.maybe.size !== hand2.maybe.size) return false;

        // Sets should contain all the same elements
        if (hand1.has.values().some(el => !hand2.has.has(el))) return false;
        if (hand1.missing.values().some(el => !hand2.missing.has(el))) return false;
        if (hand1.maybe.values().some(el => !hand2.maybe.has(el))) return false;
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
        hands.push({
            has: new Set(),
            missing: new Set(),
            maybe: new Set(),
            maybeGroups: new Map(),
        });
    }
    return hands;
}

/**
 * Determine guilty cards from hands.
 * @returns Guilty cards in a format similar to {@link Suggestion} cards.
 */
function guiltyFromHands(hands: readonly PlayerHand[]) {
    const guilty: [suspect: number | null, weapon: number | null, room: number | null] = [
        null,
        null,
        null,
    ];

    // Get cards all players are missing
    const allMissing = hands
        .map(hand => hand.missing)
        .reduce((allMissing, missing) => allMissing.intersection(missing));

    for (const packed of allMissing) {
        const [type, card] = unpackCard(packed);
        guilty[type as 0 | 1 | 2] = card;
    }

    return guilty;
}

/**
 * Find the largest list of disjoint sets.
 * Implemented based on {@link https://en.wikipedia.org/wiki/Maximum_disjoint_set#Greedy_algorithms}.
 * Note that {@link sets} _will be modified_.
 * @param sets The list of sets to search through
 */
function approximateMDS<T extends Set<unknown>>(sets: T[]): T[] {
    const disjointSets: T[] = [];

    while (sets.length) {
        /** Current set with the most intersections */
        let maxIntersectionSet: T | null = null;
        /** Number of intersections associated with {@link maxIntersectionSet} */
        let maxIntersections = 0;
        /** Index of {@link maxIntersectionSet} in {@link sets} */
        let maxIndex = -1;
        /** Sets that each set intersects with */
        const allIntersectingSets: Record<number, T[]> = {};

        for (const [i, set] of sets.entries()) {
            const intersectingSets: T[] = sets.filter(candidate => !candidate.isDisjointFrom(set));
            allIntersectingSets[i] = intersectingSets;

            // Update highest-intersection set if required
            const intersections = intersectingSets.length;
            if (intersections > maxIntersections) {
                maxIntersections = intersections;
                maxIntersectionSet = set;
                maxIndex = i;
            }
        }

        // No eligible set
        if (!maxIntersectionSet) break;

        /** Current set with the fewest intersections */
        let minIntersectionSet: T | null = null;
        /** Number of intersections associated with {@link minIntersectionSet} */
        let minIntersections: number = Infinity;
        /** Index of {@link minIntersectionSet} in {@link sets} */
        let minIndex = -1;

        for (const candidate of allIntersectingSets[maxIndex]) {
            const i = sets.indexOf(candidate);
            // Update lowest-intersection set if required
            const intersections = allIntersectingSets[i].length;
            if (intersections < minIntersections) {
                minIntersections = intersections;
                minIntersectionSet = candidate;
                minIndex = i;
            }
        }

        // No eligible set
        if (!minIntersectionSet) break;

        // Save this set and remove it from the original list
        disjointSets.push(minIntersectionSet);
        sets.splice(minIndex, 1);

        // Remove all sets that minIntersectionSet intersected with
        for (const set of allIntersectingSets[minIndex]) {
            const indexToRemove = sets.indexOf(set);
            if (indexToRemove !== -1) {
                sets.splice(indexToRemove, 1);
            }
        }
    }

    // Return the final list
    return disjointSets;
}

/**
 * Iterative function to do repeated inference for {@link infer}.
 * Originally recursive, now just separated into its own function for readability.
 */
function _infer(
    playerCardCounts: readonly number[],
    set: GameSet,
    hands: PlayerHand[],
    packedSet: readonly number[],
): PlayerHand[] {
    let lastHands: PlayerHand[];
    const totalCards = packedSet.length;

    do {
        // Tracked to see if anything changes after inference
        lastHands = structuredClone(hands);

        // Hand-by-hand inferences
        for (const [i, hand] of hands.entries()) {
            // =========================
            // If we know all but one card in a player's hand, and there exists a "maybe group"
            // which has no intersection with the "has" set,
            // then the final card must be one of the cards in the "maybe group"
            // =========================
            if (hand.has.size === playerCardCounts[i] - 1) {
                const group = hand.maybeGroups
                    .values()
                    .filter(cards => cards.isDisjointFrom(hand.has))
                    .next().value;

                if (group) {
                    for (const card of packedSet) {
                        if (!group.has(card) && !hand.has.has(card)) hand.missing.add(card);
                    }
                }
            }
            // =========================
            // If the amount of disjoint maybeGroups in the player's hand
            // equals the number of unknown cards in their hand,
            // all cards outside of those maybeGroups can be eliminated from the possibilities.
            // This is a generalization of the previous case, but it is harder to compute so we try the former first
            // =========================
            else if (hand.maybeGroups.size >= playerCardCounts[i] - hand.has.size) {
                const eligibleGroups = [
                    ...hand.maybeGroups.values().filter(cards => cards.isDisjointFrom(hand.has)),
                ];

                if (eligibleGroups.length) {
                    const disjointGroups = approximateMDS(eligibleGroups);

                    if (disjointGroups.length >= playerCardCounts[i] - hand.has.size) {
                        const cardsInHand = disjointGroups.reduce((union, current) =>
                            union.union(current),
                        );

                        const missingCards = new Set(packedSet)
                            .difference(hand.has)
                            .difference(cardsInHand);

                        for (const card of missingCards) hand.missing.add(card);
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
            const emptied: number[] = [];
            for (const [key, maybeGroup] of hand.maybeGroups) {
                // Remove any cards from maybeGroups that are marked missing
                maybeGroup.intersection(hand.missing).forEach(card => maybeGroup.delete(card));

                // If the group has one card, mark it as "has"
                if (maybeGroup.size === 1) {
                    const finalCard = maybeGroup.values().next().value!;
                    hand.has.add(finalCard);
                    maybeGroup.delete(finalCard);
                }

                // If the group is empty or no longer contains any actual maybes, mark it for deletion
                if (maybeGroup.size === 0 || maybeGroup.isDisjointFrom(hand.maybe))
                    emptied.push(key);
            }

            emptied.forEach(key => hand.maybeGroups.delete(key));
        }

        // These variables are used in the inference below the following one,
        // but the immediately following one can add cards
        const allHasPacked = hands.map(hand => hand.has).reduce((allHas, has) => allHas.union(has));
        const allHas: [Set<number>, Set<number>, Set<number>] = [new Set(), new Set(), new Set()];

        // =========================
        // If there are two maybe groups of size 2 that are common between two players,
        // then one card in the group must be held by each player (i.e. they cannot be murder cards)
        // =========================
        const sizeTwoGroups = hands.map(hand => [
            ...hand.maybeGroups.values().filter(group => group.size == 2),
        ]);

        for (let i = 0; i < hands.length - 1; i++) {
            if (!sizeTwoGroups[i].length) {
                continue;
            }

            for (let j = i + 1; j < hands.length; j++) {
                if (!sizeTwoGroups[j].length) {
                    continue;
                }

                // See if any sets are the same
                for (const set1 of sizeTwoGroups[i]) {
                    for (const set2 of sizeTwoGroups[j]) {
                        if (set1.symmetricDifference(set2).size == 0) {
                            // Get the two cards from this set
                            const values = set1.values();
                            const card1 = values.next().value!;
                            const card2 = values.next().value!;
                            allHasPacked.add(card1);
                            allHasPacked.add(card2);

                            // Rule the cards out for other players
                            for (const hand of hands.filter(
                                (hand, index) => index != i && index != j,
                            )) {
                                hand.missing.add(card1);
                                hand.missing.add(card2);
                            }
                        }
                    }
                }
            }
        }

        // =========================
        // If all but one card in a category is marked off,
        // the remaining card must be guilty
        // =========================
        for (const packed of allHasPacked) {
            const [type, card] = unpackCard(packed);
            allHas[type as 0 | 1 | 2].add(card);
        }

        for (const [type, cards] of allHas.entries()) {
            const setType = set[cardTypeToKey(type)];
            if (cards.size === setType.length - 1) {
                // Find the card that is not held by any player
                const possible = new Set(new Array(setType.length).keys());
                const card = possible.difference(cards).values().next().value!;
                // Mark this card as missing for all players
                const packed = packCard(type, card);
                for (const hand of hands) hand.missing.add(packed);
            }
        }

        const guiltyIsKnown = guiltyFromHands(hands);

        // =========================
        // If all but one player has a card marked missing,
        // and the guilty card for that category is known,
        // that one player must have the card
        // =========================
        if (guiltyIsKnown[0] || guiltyIsKnown[1] || guiltyIsKnown[2]) {
            /** A mapping of packed cards to the players who do _not_ have it */
            const missingMap: Map<number, Set<number>> = new Map();
            for (const [player, hand] of hands.entries()) {
                for (const card of hand.missing) {
                    if (!missingMap.has(card)) missingMap.set(card, new Set());
                    missingMap.get(card)!.add(player);
                }
            }

            for (const [card, missingPlayers] of missingMap.entries()) {
                if (missingPlayers.size === hands.length - 1) {
                    // Ignore if the guilty card is not known for this category
                    const [type] = unpackCard(card);
                    if (guiltyIsKnown[type as 0 | 1 | 2] == null) continue;

                    // Find the player that does not have the card
                    const player = Array.from(new Array(hands.length).keys()).find(
                        player => !missingPlayers.has(player),
                    )!;
                    // Mark them as having the card
                    hands[player].has.add(card);
                }
            }
        }
    } while (!handsEqual(hands, lastHands));

    return hands;
}

/**
 * Create player hand info based on suggestions and other inference.
 * Related to {@link updateSuggestions} and should likely only be called from there.
 * @param suggestions The suggestions to use
 * @param knowns Any knowns to take into consideration (that are _not_ derived from suggestions)
 * @param hands The hands to update
 * @param firstIsSelf Whether the player at index 0 is the user
 */
export function infer(
    suggestions: readonly Suggestion[],
    knowns: readonly Known[],
    players: number,
    playerCardCounts: readonly number[],
    set: GameSet,
    firstIsSelf: boolean,
): [hands: PlayerHand[], innocents: Set<number>] {
    const packedSet = packSet(set);
    const startingHands = emptyHands(players);

    // =======================
    // Non-iterative inference
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
                    if (!startingHands[response.player].maybeGroups.has(i))
                        startingHands[response.player].maybeGroups.set(i, new Set());
                    suggestionCards.forEach(card => {
                        startingHands![response.player].maybe.add(card);
                        startingHands![response.player].maybeGroups.get(i)!.add(card);
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
    // End of non-iterative inference
    // ==============================

    // Run iterative inference
    const hands = _infer(playerCardCounts, set, startingHands, packedSet);

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
 * Update the list of suggestions based on inference from {@link infer}.
 * This no longer has any effect on inference and is instead used to provide info to users.
 * @param suggestions The list of suggestions to update
 * @param hands Hands generated from {@link infer}
 * @returns Amended suggestions
 */
export function updateSuggestions(
    suggestions: readonly Suggestion[],
    hands: readonly PlayerHand[],
): Suggestion[] {
    const amended = structuredClone(suggestions) as Suggestion[];

    for (const [i, suggestion] of amended.entries()) {
        if (!suggestion.responses.length) {
            continue;
        }

        const packedSuggestions = suggestion.cards.map((card, type) => packCard(type, card));

        for (const [j, response] of suggestion.responses.entries()) {
            // If the card type is not unknown, there is nothing to be done
            if (response.cardType !== CardType.Unknown) {
                continue;
            }

            const missingCards = packedSuggestions
                .filter(card => hands[response.player].missing.has(card))
                .map(unpackCard);

            // If two cards are missing from this player's hand, then we know for certain what this card is
            if (missingCards.length === 2) {
                // Figure out which card type must have been shown
                const shownType = ([0, 1, 2] as const).filter(
                    type => !missingCards.some(card => card[0] === type),
                )[0];

                const shownCard = suggestion.cards[shownType];

                // Amend suggestion response
                amended[i].responses[j] = {
                    ...response,
                    cardType: shownType,
                    card: shownCard,
                    source: RevealMethod.InferSuggestion,
                };
            }
        }
    }

    return amended;
}

/**
 * Strip information from suggestions that another player should not have.
 * Used to get a preview of what another player's hand might look like.
 *
 * **NOTE**: It is assumed that `firstIsSelf` is true for this function;
 * otherwise, it has no use.
 * @param suggestions The suggestions to use
 * @param player The player whose perspective should be used
 */
export function stripSuggestions(suggestions: Suggestion[], player: number) {
    if (player === 0) return suggestions;

    const stripped = structuredClone(suggestions) as Suggestion[];

    for (const suggestion of stripped) {
        // If the provided player is not the one making the suggestion,
        // then they should not know any cards that they didn't show,
        // or that were not shown to them by another player
        if (suggestion.player !== player) {
            for (const response of suggestion.responses) {
                if (response.player !== player && response.cardType >= 0) {
                    response.card = -1;
                    response.cardType = CardType.Unknown;
                }
            }
        }
    }

    return stripped;
}

/**
 * Find suggestions that would force the reveal of a given card
 * @param target The card to reveal. Should be {@link packCard packed}
 * @param hands Player hands. It is assumed that the user is player 0
 * @param set The active game set
 * @returns Pairs of cards that can be suggested alongside the {@link target} to force its reveal
 */
export function findSuggestionForces(target: number, hands: readonly PlayerHand[], set: GameSet) {
    const packedSet = packSet(set);
    const guilty = guiltyFromHands(hands);

    // Players who might have the target card
    const potential = Array.from(hands.entries())
        .filter(([, hand]) => !hand.missing.has(target))
        .map(([player]) => player);
    if (!potential.length) return [];

    const lastPotential = potential.at(-1)!;

    const [targetType] = unpackCard(target);

    // Find cards that could be asked about to gain info on the target
    const eligibleCards: Array<{ packed: number; source: number }> = [];

    setLoop: for (const packed of packedSet) {
        const [type, card] = unpackCard(packed);
        if (type === targetType) continue;

        // Murder cards can be used to force
        if (guilty[type as 0 | 1 | 2] === card) {
            eligibleCards.push({ packed, source: -1 });
            continue;
        }

        // Cards in the user's hand can be used to force
        if (hands[0].has.has(packed)) {
            eligibleCards.push({ packed, source: 0 });
            continue;
        }

        // If there is a card marked missing for all potential players for the target card
        // (as well as any players who would come before them),
        // it can be used to force a bit more discreetly
        for (let player = 0; player <= lastPotential; player++) {
            if (!hands[player].missing.has(packed)) continue setLoop;
        }

        // If we made it outside the for loop then the card can be used
        // If we know that a player has this card, mark them as the source.
        // Otherwise, use -2 to indicate that everyone was missing it
        const handWithCard = hands.findIndex(hand => hand.has.has(packed));
        const source = handWithCard !== -1 ? handWithCard : -2;
        eligibleCards.push({ packed, source });
    }

    // Figure out permutations of cards
    const allSuggestions: Array<
        [{ packed: number; source: number }, { packed: number; source: number }]
    > = [];

    const askTypes = [0, 1, 2].filter(type => type != targetType) as [number, number];
    const firstGroup = eligibleCards.filter(ask => unpackCard(ask.packed)[0] === askTypes[0]);
    const secondGroup = eligibleCards.filter(ask => unpackCard(ask.packed)[0] === askTypes[1]);

    for (const card1 of firstGroup) {
        for (const card2 of secondGroup) {
            allSuggestions.push([card1, card2]);
        }
    }

    return allSuggestions;
}

type Triplet = `${number}|${number}|${number}`;

/** Used when probabilities run for too long */
class TimeoutError extends Error {}

/** Internal recursive function for {@link probabilities}. */
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
    const allHandsFull = hands.every((hand, i) => hand.has.size === playerCardCounts[i]);

    if (allHandsFull) {
        // Return if we know suspects, weapons, and rooms
        const [suspect, weapon, room] = guiltyFromHands(hands);

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
                const [newHands] = infer(
                    structuredClone(suggestions) as Suggestion[],
                    [...knowns, known],
                    hands.length,
                    playerCardCounts,
                    set,
                    firstIsSelf,
                );

                // Since `occurrences` is directly modified, the return value can be ignored
                _probabilities(
                    suggestions,
                    set,
                    newHands,
                    playerCardCounts,
                    firstIsSelf,
                    [...knowns, known],
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

/**
 * Determine the odds of each suspect/weapon/room being the murder cards
 * @param suggestions The amended suggestion list
 * @param set The active game set
 * @param hands Players' hands
 * @param playerCardCounts The amount of cards in each player's hands
 * @param firstIsSelf Whether the first player is the user
 * @param knowns Starting knowns
 * @param limit Milliseconds before giving up
 * @returns A record of {@link Triplets} to the amount of times those cards were found.
 * Formatted as `suspect|weapon|room` (unpacked), eg. `2|3|3`
 */
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
