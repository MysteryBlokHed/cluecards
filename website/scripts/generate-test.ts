// Test-fixture generator for the WASM inference engine.
//
// NOTE: This module can't run under plain Node. The inference package
// (`../../inference/pkg`) is built with `wasm-pack ... --target bundler` and
// requires a bundler to load. It can be run via Vitest:
//   GENERATE_INPUT=<path to GameData json> pnpm exec vitest run test/generateFixture.test.ts
// (see `website/test/generateFixture.test.ts`).

import { readFileSync, writeFileSync } from 'node:fs';
import { infer } from '../../inference/pkg/inference.js';
import SETS from '../src/lib/sets.js';
import type { PlayerHand, Suggestion } from '../src/lib/types.js';
import type { GameData } from '../test/utils.js';

// Part 1/2 of exporting sets and maps in a useful way
function handsReplacer(key: string, value: unknown): unknown {
    if (value instanceof Set) {
        const values = JSON.stringify([...value.values()], handsReplacer);
        return `<<new Set(${values})>>`;
    }

    if (value instanceof Map) {
        const values = JSON.stringify([...value.entries()], handsReplacer);
        return `<<new Map(${values})>>`;
    }

    return value;
}

/**
 * Generate an `<inputPath>.out.ts` test module from a {@link GameData} JSON file.
 *
 * Runs {@link infer} on each state of the recorded suggestions and writes the
 * per-suggestion output alongside the input as an `export default` module. Sets and
 * Maps are serialized via marker strings so they can be parsed properly.
 *
 * @returns The path of the written fixture file.
 */
export function generateFixture(inputPath: string): string {
    // Read game data from file
    const input: GameData = JSON.parse(readFileSync(inputPath, 'utf-8'));
    const { players, playerCardCounts, knowns, suggestions, firstIsSelf } = input;
    // Track outputs for each suggestion
    const output: Array<[hands: PlayerHand[], innocents: Set<number>]> = [];

    // Get inference output for gradually increasing subsets of the suggestions, storing output
    const suggestionsSubset: Suggestion[] = [];
    for (const suggestion of suggestions) {
        suggestionsSubset.push(suggestion);
        const [hands, innocents] = infer(
            suggestionsSubset,
            knowns,
            players,
            playerCardCounts,
            SETS.Clue,
            firstIsSelf,
        );

        output.push([hands, innocents]);
    }

    const returned = {
        input: { players, playerCardCounts, knowns, suggestions, firstIsSelf } satisfies GameData,
        output,
    } as const;

    const outPath = `${inputPath}.out.ts`;
    writeFileSync(
        outPath,
        // Part 2/2 of exporting sets and maps in a useful way
        'export default ' +
            JSON.stringify(returned, handsReplacer).replaceAll(/\\?"<<|>>\\?"/g, ''),
    );

    return outPath;
}
