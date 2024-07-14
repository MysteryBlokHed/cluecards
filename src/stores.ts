import { writable } from 'svelte/store';
import SETS from './sets';
import { type Known, type GameSet, type Suggestion, type PlayerHand } from './types';

const storedSet: keyof typeof SETS = sessionStorage.setName ?? 'Clue';
export const set = writable<[keyof typeof SETS, GameSet]>([storedSet, SETS[storedSet]]);
set.subscribe(newSet => (sessionStorage.setName = newSet[0]));

const storedPlayers: string[] = sessionStorage.players ? JSON.parse(sessionStorage.players) : [''];
export const players = writable(storedPlayers);
players.subscribe(newPlayers => (sessionStorage.players = JSON.stringify(newPlayers)));

export const playerHands = writable<PlayerHand[]>([
    { has: new Set(), missing: new Set(), maybe: new Set() },
]);

const storedSuggestions: Suggestion[] = sessionStorage.suggestions
    ? JSON.parse(sessionStorage.suggestions)
    : [];
export const suggestions = writable(storedSuggestions);
suggestions.subscribe(
    newSuggestions => (sessionStorage.suggestions = JSON.stringify(newSuggestions)),
);
// export const suggestions = writable<Suggestion[]>([
//     {
//         player: 2,
//         cards: [1, 2, 1],
//         responses: [
//             { player: 3, cardType: -2, card: -1 },
//             { player: 4, cardType: -2, card: -1 },
//             { player: 5, cardType: -1, card: -1 },
//         ],
//     },
//     { player: 3, cards: [5, 1, 0], responses: [{ player: 4, cardType: -1, card: -1 }] },
//     {
//         player: 4,
//         cards: [0, 5, 3],
//         responses: [
//             { player: 5, cardType: -2, card: -1 },
//             { player: 0, cardType: -2, card: -1 },
//             { player: 1, cardType: -2, card: -1 },
//             { player: 2, cardType: -2, card: -1 },
//             { player: 3, cardType: -1, card: -1 },
//         ],
//     },
//     {
//         player: 0,
//         cards: [5, 3, 6],
//         responses: [
//             { player: 1, cardType: -2, card: -1 },
//             { player: 2, cardType: 0, card: 5 },
//         ],
//     },
//     { player: 1, cards: [4, 0, 8], responses: [{ player: 2, cardType: -1, card: -1 }] },
//     { player: 2, cards: [0, 5, 5], responses: [{ player: 3, cardType: -1, card: -1 }] },
//     {
//         player: 3,
//         cards: [4, 4, 3],
//         responses: [
//             { player: 4, cardType: -2, card: -1 },
//             { player: 5, cardType: -1, card: -1 },
//         ],
//     },
//     {
//         player: 5,
//         cards: [4, 0, 2],
//         responses: [
//             { player: 0, cardType: -2, card: -1 },
//             { player: 1, cardType: -2, card: -1 },
//             { player: 2, cardType: -2, card: -1 },
//             { player: 3, cardType: -1, card: -1 },
//         ],
//     },
//     { player: 0, cards: [1, 1, 0], responses: [{ player: 1, cardType: 1, card: 1 }] },
//     {
//         player: 1,
//         cards: [0, 1, 6],
//         responses: [
//             { player: 2, cardType: -2, card: -1 },
//             { player: 3, cardType: -2, card: -1 },
//             { player: 4, cardType: -1, card: -1 },
//         ],
//     },
// ]);

const storedKnowns: Known[] = sessionStorage.startingKnowns
    ? JSON.parse(sessionStorage.startingKnowns)
    : [];
export const startingKnowns = writable<Known[]>(storedKnowns);
startingKnowns.subscribe(
    newStartingKnowns => (sessionStorage.startingKnowns = JSON.stringify(newStartingKnowns)),
);
