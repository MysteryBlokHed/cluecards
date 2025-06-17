import { packSet, packCard, unpackCard } from './cards.js';
import { CardType, RevealMethod } from './types.js';
import type { GameSet, PlayerHand, Suggestion } from './types.js';

// Uses a web worker to run WASM code instead of doing it on the main thread.
// For normal inference this was never really an issue,
// but the probabilities code is prone to running for a long time,
// and it blocks the main thread while it runs.
// My tests have shown that moving it to a web worker doesn't negatively affect its performance.
import InferenceWorker from './inference-worker.ts?worker';
import type { InferenceWorkerApi } from './inference-worker';
import { wrap } from 'comlink';

export const inference = (async () => {
    // The Comlink API isn't available immediately since the worker
    // first needs to import the WASM module, which takes a few hundred milliseconds.
    // This code waits until the worker reports that it's ready before doing anything else.
    const inferenceWorker = new InferenceWorker({ name: 'inference-worker' });
    await new Promise<void>(resolve => {
        inferenceWorker.addEventListener('message', function listener(e) {
            if (e.data?.__ready) {
                inferenceWorker.removeEventListener('message', listener);
                resolve();
            }
        });
    });

    // Comlink is now available--return the wrapped object
    const wrapped = wrap<InferenceWorkerApi>(inferenceWorker);
    return wrapped;
})();

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
