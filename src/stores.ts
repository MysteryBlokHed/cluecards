import { get, writable } from 'svelte/store';
import SETS from './sets.js';
import type { Known, GameSet, Suggestion, PlayerHand, Preferences } from './types.js';

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

export const sets = persistent<Record<string, GameSet>>(
    'customSets',
    structuredClone(SETS),
    localStorage,
);
let $sets: Record<string, GameSet> = get(sets);
sets.subscribe(newValue => {
    $sets = newValue;
    // Re-add default sets if the list is empty
    if (Object.keys($sets).length === 0) {
        sets.set(structuredClone(SETS));
    }
});

// This is stored slightly differently and cannot use persistentStore()
const storedSet: string = sessionStorage.setName ?? 'Clue';
export const set = writable<[string, GameSet]>([storedSet, $sets[storedSet]]);
set.subscribe(newSet => (sessionStorage.setName = newSet[0]));

export const players = persistent('players', ['', '', '']);

export const playerCardCounts = persistent('playerCards', [6, 6, 6]);

const playerHandsInit: PlayerHand[] = [];
for (let i = 0; i < get(playerCardCounts).length; i++) {
    playerHandsInit.push({
        has: new Set(),
        missing: new Set(),
        maybe: new Set(),
        maybeGroups: new Map(),
    });
}

export const playerHands = writable<PlayerHand[]>(playerHandsInit);

export const innocents = writable<Set<number>>(new Set());

export const suggestions = persistent<Suggestion[]>('suggestions', []);

export const startingKnowns = persistent<Known[]>('startingKnowns', []);

export const preferences = persistent<Preferences>(
    'preferences',
    {
        autoSelectNone: true,
        autoHideImpossible: true,
        selectNextPlayers: true,
        firstIsSelf: true,
        hideFirstColumn: false,
    },
    localStorage,
);

/**
 * If {@link Preferences.firstIsSelf} is true,
 * then this dictates whose POV we are using to generate the clue sheet
 */
export const playerPov = writable(0);
