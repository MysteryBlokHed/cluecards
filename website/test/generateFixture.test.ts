import { describe, it, expect } from 'vitest';
import { generateFixture } from '../scripts/generate-test.js';

const input = process.env.GENERATE_INPUT;

describe.skipIf(!input)('fixture generation (set GENERATE_INPUT=<path to GameData json>)', () => {
    it('generates a fixture module', () => {
        const outPath = generateFixture(input!);
        expect(outPath).toMatch(/\.out\.ts$/);
    });
});
