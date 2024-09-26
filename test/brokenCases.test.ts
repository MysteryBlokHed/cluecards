import { describe, it, expect } from 'vitest';

import { handsEqual, infer } from '../src/inference';
import SETS from '../src/sets';
import type { Known, Suggestion } from '../src/types';
import * as states from './states';

describe('game states that caused errors during development', () => {
    it('approximateMDS issues', () => {
        const { suggestions, knowns, players, playerCardCounts, hands } =
            states.approximateMDSIssues;

        const [resultHands] = infer(
            suggestions as Suggestion[],
            knowns as Known[],
            players.length,
            playerCardCounts,
            SETS.Clue,
            true,
        );

        expect(handsEqual(resultHands, hands)).toBeTruthy();
    });
});
