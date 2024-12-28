import { expect } from 'vitest';
import { infer } from '../inference/pkg/inference.js';
import SETS from '../src/sets.js';
import type { Known, PlayerHand, Suggestion } from '../src/types.js';

export interface GameData {
    players: number;
    playerCardCounts: number[];
    knowns: Known[];
    suggestions: Suggestion[];
    firstIsSelf: boolean;
}

export interface TestData {
    input: GameData;
    output: Array<[hands: PlayerHand[], innocents: Set<number>]>;
}

/**
 * Assert that every suggestion in a game state produces the expected output,
 * rather than just testing the final state with _all_ suggestions included.
 */
export function deepTest({ input, output }: TestData) {
    const { players, playerCardCounts, knowns, suggestions, firstIsSelf } = input;

    const suggestionsSubset: Suggestion[] = [];
    for (const [i, suggestion] of suggestions.entries()) {
        suggestionsSubset.push(suggestion);

        const [hands, innocents] = infer(
            suggestionsSubset,
            knowns,
            players,
            playerCardCounts,
            SETS.Clue,
            firstIsSelf,
        );

        for (const hand of output[i][0]) {
            hand.maybeGroups = [...hand.maybeGroups.values()];
        }

        expect(hands).toEqual(output[i][0]);
        expect(innocents).toEqual(output[i][1]);
    }
}
