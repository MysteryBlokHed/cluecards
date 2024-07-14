import { writable } from 'svelte/store';
import SETS from './sets';
import { type Known, type GameSet, type Suggestion, type PlayerHand } from './types';

function persistentStore<T>(key: string, defaultValue: T, storage = sessionStorage) {
    const storedValue: T = storage[key] ? JSON.parse(storage[key]) : defaultValue;
    const store = writable(storedValue);
    store.subscribe(newValue => (storage[key] = JSON.stringify(newValue)));
    return store;
}

export const customSets = persistentStore<Record<string, GameSet>>('customSets', {}, localStorage);
let $customSets: Record<string, GameSet>;
customSets.subscribe(newValue => ($customSets = newValue));

function getSet(name: string): GameSet {
    // Start with builtin sets
    if (name in SETS) return SETS[name as keyof typeof SETS];
    // Try custom sets
    if (name in $customSets) return $customSets[name];
    throw new Error('Could not find set with name ' + name);
}

const storedSet: string = sessionStorage.setName ?? 'Clue';
export const set = writable<[string, GameSet]>([storedSet, getSet(storedSet)]);
set.subscribe(newSet => (sessionStorage.setName = newSet[0]));

export const players = persistentStore('players', ['']);

export const playerHands = writable<PlayerHand[]>([
    { has: new Set(), missing: new Set(), maybe: new Set() },
]);

export const suggestions = persistentStore<Suggestion[]>('suggestions', []);

export const startingKnowns = persistentStore<Known[]>('startingKnowns', []);
