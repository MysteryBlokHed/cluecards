import type { GameSet } from './types.js';

/** Resolve a set name against the catalog, falling back to 'Clue' and then to any existing set. */
export function resolveSet(name: string, catalog: Map<string, GameSet>): [string, GameSet] {
    const found = catalog.get(name);
    if (found) return [name, found];
    const clue = catalog.get('Clue');
    if (clue) return ['Clue', clue];
    const first = catalog.entries().next().value;
    if (first) return first;
    // Unreachable in practice: the sets subscriber re-seeds defaults when the map is empty
    throw new Error('No game sets available');
}
