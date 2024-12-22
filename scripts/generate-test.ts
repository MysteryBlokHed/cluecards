import { readFileSync, writeFileSync } from 'node:fs';
import { infer } from '../src/inference.js';
import SETS from '../src/sets.js';
import type { Known, PlayerHand, Suggestion } from '../src/types.js';

const args = process.argv.slice(2);
if (!args.length) {
    console.error('Expected filename as argument');
    process.exit(1);
}

interface GameData {
    players: number;
    playerCardCounts: number[];
    knowns: Known[];
    suggestions: Suggestion[];
    firstIsSelf: boolean;
}

// Read game data from file
const filename = args.pop()!;
const input: GameData = JSON.parse(readFileSync(filename, 'utf-8'));
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

const returned = {
    input: { players, playerCardCounts, knowns, suggestions, firstIsSelf } satisfies GameData,
    output,
} as const;

writeFileSync(
    `${filename}.out.ts`,
    // Part 2/2 of exporting sets and maps in a useful way
    'export default ' + JSON.stringify(returned, handsReplacer).replaceAll(/\\?"<<|>>\\?"/g, ''),
);
