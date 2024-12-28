import { describe, it, expect } from 'vitest';

import { packSet } from '../src/cards.js';
import { infer } from '../inference/pkg/inference.js';
import SETS from '../src/sets.js';
import { CardType, RevealMethod, type Known, type Suggestion } from '../src/types.js';

import { inference } from './states/';
import { deepTest, TestData } from './utils.js';

const EMPTY_SET: Set<unknown> = new Set();

describe('non-iterative inference methods', () => {
    it('handles custom knowns', () => {
        // Before
        {
            const [hands] = infer([], [], 3, [6, 6, 6], SETS.Clue, false);
            expect(hands[0].has).toEqual(EMPTY_SET);
            expect(hands[0].missing).toEqual(EMPTY_SET);
            expect(hands[0].maybe).toEqual(EMPTY_SET);
            expect(hands[0].maybeGroups).toEqual([]);
        }

        // After
        {
            const knowns = [
                {
                    type: 'innocent',
                    cardType: CardType.Suspect,
                    card: 1,
                    player: 0,
                    source: RevealMethod.InferSuggestion,
                },
            ] as const satisfies Known[];

            const [hands] = infer([], knowns, 3, [6, 6, 6], SETS.Clue, false);

            expect(hands[0].has).toEqual(new Set([4]));
            expect(hands[0].missing).toEqual(EMPTY_SET);
            expect(hands[0].maybe).toEqual(EMPTY_SET);
            expect(hands[0].maybeGroups).toEqual([]);
        }
    });

    it('handles firstIsSelf', () => {
        const knowns = [
            {
                type: 'innocent',
                cardType: CardType.Suspect,
                card: 1,
                player: 0,
                source: RevealMethod.Self,
            },
        ] as const satisfies Known[];

        const restOfSet = new Set(packSet(SETS.Clue));
        restOfSet.delete(4);

        const [hands] = infer([], knowns, 3, [6, 6, 6], SETS.Clue, true);
        expect(hands[0].has).toEqual(new Set([4]));
        expect(hands[0].missing).toEqual(restOfSet);
        expect(hands[0].maybe).toEqual(EMPTY_SET);
        expect(hands[0].maybeGroups).toEqual([]);
    });

    describe('handles suggestions', () => {
        it('player showns nothing', () => {
            const suggestions = [
                {
                    player: 1,
                    cards: [1, 1, 1],
                    responses: [
                        {
                            player: 2,
                            cardType: CardType.Nothing,
                            card: -1,
                        },
                    ],
                },
            ] as const satisfies Suggestion[];

            const [hands] = infer(suggestions, [], 3, [6, 6, 6], SETS.Clue, false);
            // We know nothing about this player
            expect(hands[0].has).toEqual(EMPTY_SET);
            expect(hands[0].missing).toEqual(EMPTY_SET);
            expect(hands[0].maybe).toEqual(EMPTY_SET);
            expect(hands[0].maybeGroups).toEqual([]);
            // We know nothing about this player
            expect(hands[1].has).toEqual(EMPTY_SET);
            expect(hands[1].missing).toEqual(EMPTY_SET);
            expect(hands[1].maybe).toEqual(EMPTY_SET);
            expect(hands[1].maybeGroups).toEqual([]);
            // Player can't have suggested cards
            expect(hands[2].has).toEqual(EMPTY_SET);
            expect(hands[2].missing).toEqual(new Set([4, 5, 6]));
            expect(hands[2].maybe).toEqual(EMPTY_SET);
            expect(hands[2].maybeGroups).toEqual([]);
        });

        it('player shows unknown', () => {
            const suggestions = [
                {
                    player: 1,
                    cards: [1, 1, 1],
                    responses: [
                        {
                            player: 2,
                            cardType: CardType.Unknown,
                            card: -1,
                        },
                    ],
                },
            ] as const satisfies Suggestion[];

            const [hands] = infer(suggestions, [], 3, [6, 6, 6], SETS.Clue, false);
            // We know nothing about this player
            expect(hands[0].has).toEqual(EMPTY_SET);
            expect(hands[0].missing).toEqual(EMPTY_SET);
            expect(hands[0].maybe).toEqual(EMPTY_SET);
            expect(hands[0].maybeGroups).toEqual([]);
            // We know nothing about this player
            expect(hands[1].has).toEqual(EMPTY_SET);
            expect(hands[1].missing).toEqual(EMPTY_SET);
            expect(hands[1].maybe).toEqual(EMPTY_SET);
            expect(hands[1].maybeGroups).toEqual([]);
            // Player has one of the suggested cards
            expect(hands[2].has).toEqual(EMPTY_SET);
            expect(hands[2].missing).toEqual(EMPTY_SET);
            expect(hands[2].maybe).toEqual(new Set([4, 5, 6]));
            expect(hands[2].maybeGroups).toEqual([new Set([4, 5, 6])]);
        });

        it('player shows specific card', () => {
            const suggestions = [
                {
                    player: 1,
                    cards: [1, 1, 1],
                    responses: [
                        {
                            player: 2,
                            cardType: CardType.Suspect,
                            card: 1,
                        },
                    ],
                },
            ] as const satisfies Suggestion[];

            const [hands] = infer(suggestions, [], 3, [6, 6, 6], SETS.Clue, false);

            // This player cannot have the shown card
            expect(hands[0].has).toEqual(EMPTY_SET);
            expect(hands[0].missing).toEqual(new Set([4]));
            expect(hands[0].maybe).toEqual(EMPTY_SET);
            expect(hands[0].maybeGroups).toEqual([]);
            // This player cannot have the shown card
            expect(hands[1].has).toEqual(EMPTY_SET);
            expect(hands[1].missing).toEqual(new Set([4]));
            expect(hands[1].maybe).toEqual(EMPTY_SET);
            expect(hands[1].maybeGroups).toEqual([]);
            // This player must have the shown card
            expect(hands[2].has).toEqual(new Set([4]));
            expect(hands[2].missing).toEqual(EMPTY_SET);
            expect(hands[2].maybe).toEqual(EMPTY_SET);
            expect(hands[2].maybeGroups).toEqual([]);
        });

        it('combination of all', () => {
            const suggestions = [
                // Suggestion with nothing shown
                {
                    player: 0,
                    cards: [1, 1, 1],
                    responses: [
                        { player: 1, cardType: CardType.Nothing, card: -1 },
                        { player: 2, cardType: CardType.Nothing, card: -1 },
                    ],
                },
                // Suggestion with unknown shown
                {
                    player: 1,
                    cards: [2, 2, 2],
                    responses: [{ player: 2, cardType: CardType.Unknown, card: -1 }],
                },
                // Suggestion with known shown
                {
                    player: 2,
                    cards: [3, 3, 3],
                    responses: [{ player: 0, cardType: CardType.Suspect, card: 3 }],
                },
            ] as const satisfies Suggestion[];

            const [hands] = infer(suggestions, [], 3, [6, 6, 6], SETS.Clue, false);

            // This player should only have the shown card
            expect(hands[0].has).toEqual(new Set([12]));
            expect(hands[0].missing).toEqual(EMPTY_SET);
            expect(hands[0].maybe).toEqual(EMPTY_SET);
            expect(hands[0].maybeGroups).toEqual([]);
            // This player should be missing the cards with nothing shown _AND_ the card in the first player's hand
            expect(hands[1].has).toEqual(EMPTY_SET);
            expect(hands[1].missing).toEqual(new Set([12, 4, 5, 6]));
            expect(hands[1].maybe).toEqual(EMPTY_SET);
            expect(hands[1].maybeGroups).toEqual([]);
            // Same as above, but also the player might have shown one of {8, 9, 10} (packed)
            expect(hands[2].has).toEqual(EMPTY_SET);
            expect(hands[2].missing).toEqual(new Set([12, 4, 5, 6]));
            expect(hands[2].maybe).toEqual(new Set([8, 9, 10]));
            expect(hands[2].maybeGroups).toEqual([new Set([8, 9, 10])]);
        });
    });
});

describe('iterative inference methods', () => {
    it("hand disjointedness (a card may only be in one player's hand)", () => {
        const knowns = [
            {
                type: 'innocent',
                cardType: CardType.Suspect,
                card: 1,
                player: 0,
                source: RevealMethod.Self,
            },
        ] as const satisfies Known[];

        const [hands] = infer([], knowns, 3, [6, 6, 6], SETS.Clue, false);
        // This player should only have the known card
        expect(hands[0].has).toEqual(new Set([4]));
        expect(hands[0].missing).toEqual(EMPTY_SET);
        expect(hands[0].maybe).toEqual(EMPTY_SET);
        expect(hands[0].maybeGroups).toEqual([]);
        // This player should have the known card ruled out
        expect(hands[1].has).toEqual(EMPTY_SET);
        expect(hands[1].missing).toEqual(new Set([4]));
        expect(hands[1].maybe).toEqual(EMPTY_SET);
        expect(hands[1].maybeGroups).toEqual([]);
        // This player should have the known card ruled out
        expect(hands[2].has).toEqual(EMPTY_SET);
        expect(hands[2].missing).toEqual(new Set([4]));
        expect(hands[2].maybe).toEqual(EMPTY_SET);
        expect(hands[2].maybeGroups).toEqual([]);
    });

    describe('maybe group inferences', () => {
        it('handles single-element case for maybe group', () =>
            deepTest(inference.singleMaybeGroup as unknown as TestData));

        it('handles multi-element case for maybe group', () =>
            deepTest(inference.multiMaybeGroup as unknown as TestData));

        it('properly uses MHS to narrow down maybe groups', () =>
            deepTest(inference.maybeGroupMHS as unknown as TestData));

        it("MHS catches cases that MDS didn't", () =>
            deepTest(inference.minimumHittingSet as unknown as TestData));
    });

    describe('card count inferences', () => {
        it('handles players who have reached max card count', () =>
            deepTest(inference.maxCardCount as unknown as TestData));

        it('handles players who have reached min card count', () =>
            deepTest(inference.minCardCount as unknown as TestData));
    });

    it('common pair of size-two maybe groups', () =>
        deepTest(inference.sizeTwoMaybeGroups as unknown as TestData));

    it('if all but one card in a category are innocent, the last is guilty', () =>
        deepTest(inference.allButOneInnocent as unknown as TestData));

    it('if the guilty card in a category is known, other cards are innocent', () =>
        deepTest(inference.oneWithGuilty as unknown as TestData));

    describe('multiple cards for which only one player not ruled out', () => {
        it('works on a single category', () =>
            deepTest(inference.soloMultiMissingSingleCat as unknown as TestData));

        it('works for multiple categories', () =>
            deepTest(inference.soloMultiMissingMultiCat as unknown as TestData));
    });
});
