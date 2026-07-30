import { describe, it, expect } from 'vitest';

import { resolveSet } from '../src/lib/resolveSet.js';
import type { GameSet } from '../src/lib/types.js';

const clueSet: GameSet = { suspects: ['Green'], weapons: ['Rope'], rooms: ['Study'] };
const customSet: GameSet = { suspects: ['Robot'], weapons: ['Laser'], rooms: ['Bridge'] };

describe('resolveSet', () => {
    it('resolves a known name to itself', () => {
        const catalog = new Map<string, GameSet>([
            ['Clue', clueSet],
            ['Custom', customSet],
        ]);
        expect(resolveSet('Custom', catalog)).toEqual(['Custom', customSet]);
    });

    it('falls back to Clue when the name is unknown', () => {
        const catalog = new Map<string, GameSet>([
            ['Clue', clueSet],
            ['Custom', customSet],
        ]);
        expect(resolveSet('Deleted', catalog)).toEqual(['Clue', clueSet]);
    });

    it('falls back to the first entry when the name is unknown and Clue is absent', () => {
        const catalog = new Map<string, GameSet>([['Custom', customSet]]);
        expect(resolveSet('Deleted', catalog)).toEqual(['Custom', customSet]);
    });

    it('throws when the catalog is empty', () => {
        const catalog = new Map<string, GameSet>();
        expect(() => resolveSet('anything', catalog)).toThrow('No game sets available');
    });
});
