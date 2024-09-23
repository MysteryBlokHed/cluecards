import { packSet, packCard, unpackCard, packSuggestions, cardTypeToKey } from './cards';
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
 * Internal recursive function for {@link infer}.
 */
function _infer(
    playerCardCounts: readonly number[],
    set: GameSet,
    hands: PlayerHand[],
    packedSet: readonly number[],
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

            // If the group is empty or no longer contains any actual maybes, mark it for deletion
            if (maybeGroup.size === 0 || maybeGroup.isDisjointFrom(hand.maybe)) emptied.push(key);
        }

        emptied.forEach(key => delete hand.maybeGroups[key as unknown as number]);
    }

    // =========================
    // If all but one card in a category is marked off,
    // the remaining card must be guilty
    // =========================
    const allHasPacked = hands.map(hand => hand.has).reduce((allHas, has) => allHas.union(has));
    const allHas: [Set<number>, Set<number>, Set<number>] = [new Set(), new Set(), new Set()];

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
    if (handsEqual(hands, lastHands)) return hands;
    else return _infer(playerCardCounts, set, hands, packedSet);
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
        const source = hands.findIndex(hand => hand.has.has(packed)) ?? -2;
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
