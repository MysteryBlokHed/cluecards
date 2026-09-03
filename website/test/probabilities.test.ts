import { describe, it, expect } from 'vitest';

import { infer, probabilities } from '../../inference/pkg/inference.js';
import SETS from '../src/lib/sets.js';

import { randomGames } from './states/';
import type { TestData } from './utils.js';

// Clue set category sizes, used to bound the murder-triple keys
const SUSPECTS = 6;
const WEAPONS = 6;
const ROOMS = 9;

describe('probabilities smoke test', () => {
    it('produces a valid murder-triple occurrence map for fixture 1', () => {
        const { players, playerCardCounts, knowns, suggestions, firstIsSelf } = (
            randomGames[0] as TestData
        ).input;

        const [hands] = infer(
            suggestions,
            knowns,
            players,
            playerCardCounts,
            SETS.Clue,
            firstIsSelf,
        );

        const probs = probabilities(
            suggestions,
            SETS.Clue,
            hands,
            playerCardCounts,
            firstIsSelf,
            knowns,
        ) as Map<[number, number, number], number>;

        // Check that results are roughly the right shape
        expect(probs).toBeInstanceOf(Map);
        expect(probs.size).toBeGreaterThan(0);

        const seen = new Set<string>();
        for (const [triple, count] of probs.entries()) {
            // Key is a length-3 array of in-bounds numbers
            expect(Array.isArray(triple)).toBe(true);
            expect(triple).toHaveLength(3);

            const [suspect, weapon, room] = triple;
            for (const n of triple) {
                expect(Number.isInteger(n)).toBe(true);
            }
            expect(suspect).toBeGreaterThanOrEqual(0);
            expect(suspect).toBeLessThan(SUSPECTS);
            expect(weapon).toBeGreaterThanOrEqual(0);
            expect(weapon).toBeLessThan(WEAPONS);
            expect(room).toBeGreaterThanOrEqual(0);
            expect(room).toBeLessThan(ROOMS);

            // Value is a positive integer
            expect(Number.isInteger(count)).toBe(true);
            expect(count).toBeGreaterThan(0);

            // Keys are unique triples
            const key = triple.join(',');
            expect(seen.has(key)).toBe(false);
            seen.add(key);
        }
    });
});
