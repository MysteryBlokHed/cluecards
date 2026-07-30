import { describe, it, expect } from 'vitest';

import { isGameSetShaped, setIsValid, MAX_CARDS_PER_CATEGORY } from '../src/lib/setValidation.js';
import SETS from '../src/lib/sets.js';
import type { GameSet } from '../src/lib/types.js';

const validSet: GameSet = {
    suspects: ['Green', 'Mustard'],
    weapons: ['Rope', 'Wrench'],
    rooms: ['Kitchen', 'Study'],
};

describe('isGameSetShaped', () => {
    it('accepts a valid GameSet', () => {
        expect(isGameSetShaped(validSet)).toBe(true);
    });

    it('rejects null', () => {
        expect(isGameSetShaped(null)).toBe(false);
    });

    it('rejects an array', () => {
        expect(isGameSetShaped([])).toBe(false);
    });

    it('rejects a set missing rooms', () => {
        expect(isGameSetShaped({ suspects: ['a', 'b'], weapons: ['c', 'd'] })).toBe(false);
    });

    it('rejects a category containing a number', () => {
        expect(
            isGameSetShaped({ suspects: ['a', 2], weapons: ['c', 'd'], rooms: ['e', 'f'] }),
        ).toBe(false);
    });

    it('rejects a category that is a string', () => {
        expect(isGameSetShaped({ suspects: 'nope', weapons: ['c', 'd'], rooms: ['e', 'f'] })).toBe(
            false,
        );
    });
});

describe('setIsValid', () => {
    it('accepts the standard Clue set', () => {
        expect(setIsValid(SETS.Clue)).toBe(true);
    });

    it('rejects null', () => {
        expect(setIsValid(null)).toBe(false);
    });

    it('rejects a category with 17 entries', () => {
        const oversized: GameSet = {
            suspects: Array.from({ length: 17 }, (_, i) => `S${i}`),
            weapons: ['Rope', 'Wrench'],
            rooms: ['Kitchen', 'Study'],
        };
        expect(setIsValid(oversized)).toBe(false);
    });

    it('rejects duplicates across categories', () => {
        const dupes: GameSet = {
            suspects: ['Green', 'Mustard'],
            weapons: ['Rope', 'Green'],
            rooms: ['Kitchen', 'Study'],
        };
        expect(setIsValid(dupes)).toBe(false);
    });

    it('rejects an empty-string entry', () => {
        const empty: GameSet = {
            suspects: ['Green', ''],
            weapons: ['Rope', 'Wrench'],
            rooms: ['Kitchen', 'Study'],
        };
        expect(setIsValid(empty)).toBe(false);
    });

    it('rejects a category with fewer than 2 entries', () => {
        const tooFew: GameSet = {
            suspects: ['Green'],
            weapons: ['Rope', 'Wrench'],
            rooms: ['Kitchen', 'Study'],
        };
        expect(setIsValid(tooFew)).toBe(false);
    });

    it('accepts a category with exactly 16 unique entries', () => {
        const maxed: GameSet = {
            suspects: Array.from({ length: MAX_CARDS_PER_CATEGORY }, (_, i) => `S${i}`),
            weapons: ['Rope', 'Wrench'],
            rooms: ['Kitchen', 'Study'],
        };
        expect(setIsValid(maxed)).toBe(true);
    });
});
