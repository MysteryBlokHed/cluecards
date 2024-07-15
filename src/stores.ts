import { writable } from 'svelte/store';
import SETS from './sets';
import { type Known, type GameSet, type Suggestion, type PlayerHand } from './types';

/**
 * Creates a {@link writable} store which automatically loads from/saves to a storage.
 * @param key The key to use on the {@link storage}
 * @param defaultValue The starting value if the key is not found
 * @param storage The storage medium to use
 */
function persistent<T>(key: string, defaultValue: T, storage = sessionStorage) {
    const storedValue: T = storage[key] ? JSON.parse(storage[key]) : defaultValue;
    const store = writable(storedValue);
    store.subscribe(newValue => (storage[key] = JSON.stringify(newValue)));
    return store;
}

export const customSets = persistent<Record<string, GameSet>>('customSets', {}, localStorage);
let $customSets: Record<string, GameSet>;
customSets.subscribe(newValue => ($customSets = newValue));

/**
 * Tries to retrieve a game set, giving priority to the builtin ones.
 * @param name The set's (display) name
 * @returns The set, if found
 * @throws {Error} If a set with the provided name could not be found
 */
export function getSet(name: string): GameSet {
    // Start with builtin sets
    if (name in SETS) return SETS[name as keyof typeof SETS];
    // Try custom sets
    if (name in $customSets) return $customSets[name];
    throw new Error('Could not find set with name ' + name);
}

// This is stored slightly differently and cannot use persistentStore()
const storedSet: string = sessionStorage.setName ?? 'Clue';
export const set = writable<[string, GameSet]>([storedSet, getSet(storedSet)]);
set.subscribe(newSet => (sessionStorage.setName = newSet[0]));

export const players = persistent('players', ['']);

export const playerHands = writable<PlayerHand[]>([
    { has: new Set(), missing: new Set(), maybe: new Set() },
]);

export const suggestions = persistent<Suggestion[]>('suggestions', []);

export const startingKnowns = persistent<Known[]>('startingKnowns', []);
