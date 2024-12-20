export default {
    players: ['Orchid', 'Peacock', 'Adler', 'Meadow-Brook', 'Peach', 'Scarlett'],
    playerCardCounts: [3, 3, 3, 3, 3, 3],
    knowns: [
        { type: 'innocent', cardType: 0, card: 5, player: 0, source: 0 },
        { type: 'innocent', cardType: 1, card: 2, player: 0, source: 0 },
        { type: 'innocent', cardType: 2, card: 1, player: 0, source: 0 },
    ],
    suggestions: [
        {
            player: 2,
            cards: [3, 1, 0],
            responses: [{ player: 3, cardType: -1, card: -1 }],
        },
        {
            player: 3,
            cards: [0, 3, 0],
            responses: [{ player: 4, cardType: -1, card: -1 }],
        },
        {
            player: 4,
            cards: [1, 5, 0],
            responses: [
                { player: 5, cardType: -2, card: -1 },
                { player: 0, cardType: -2, card: -1 },
                { player: 1, cardType: -2, card: -1 },
                { player: 2, cardType: -1, card: -1 },
            ],
        },
        {
            player: 5,
            cards: [5, 3, 6],
            responses: [{ player: 0, cardType: 0, card: 5, source: 0 }],
        },
        {
            player: 0,
            cards: [2, 4, 2],
            responses: [{ player: 1, cardType: 2, card: 2, source: 1 }],
        },
        {
            player: 1,
            cards: [4, 3, 2],
            responses: [{ player: 2, cardType: -1, card: -1 }],
        },
        {
            player: 2,
            cards: [5, 4, 2],
            responses: [
                { player: 3, cardType: -2, card: -1 },
                { player: 4, cardType: -2, card: -1 },
                { player: 5, cardType: -2, card: -1 },
                { player: 0, cardType: 0, card: 5, source: 0 },
            ],
        },
        {
            player: 3,
            cards: [3, 0, 3],
            responses: [{ player: 4, cardType: -1, card: -1 }],
        },
        {
            player: 4,
            cards: [2, 3, 0],
            responses: [
                { player: 5, cardType: -2, card: -1 },
                { player: 0, cardType: -2, card: -1 },
                { player: 1, cardType: -2, card: -1 },
                { player: 2, cardType: -1, card: -1 },
            ],
        },
        {
            player: 5,
            cards: [3, 1, 1],
            responses: [{ player: 0, cardType: 2, card: 1, source: 0 }],
        },
        {
            player: 0,
            cards: [3, 3, 5],
            responses: [
                { player: 1, cardType: -2, card: -1 },
                { player: 2, cardType: 0, card: 3, source: 1 },
            ],
        },
        {
            player: 1,
            cards: [4, 2, 7],
            responses: [
                { player: 2, cardType: -2, card: -1 },
                { player: 3, cardType: -1, card: -1 },
            ],
        },
        {
            player: 2,
            cards: [4, 0, 2],
            responses: [{ player: 3, cardType: -1, card: -1 }],
        },
        {
            player: 3,
            cards: [0, 4, 3],
            responses: [
                { player: 4, cardType: -2, card: -1 },
                { player: 5, cardType: -1, card: -1 },
            ],
        },
        {
            player: 4,
            cards: [0, 1, 0],
            responses: [
                { player: 5, cardType: -2, card: -1 },
                { player: 0, cardType: -2, card: -1 },
                { player: 1, cardType: -1, card: -1 },
            ],
        },
        {
            player: 5,
            cards: [3, 0, 6],
            responses: [
                { player: 0, cardType: -2, card: -1 },
                { player: 1, cardType: -1, card: -1 },
            ],
        },
        {
            player: 0,
            cards: [2, 4, 5],
            responses: [
                { player: 1, cardType: -2, card: -1 },
                { player: 2, cardType: -2, card: -1 },
                { player: 3, cardType: 0, card: 2, source: 1 },
            ],
        },
    ],
    hands: [
        {
            has: new Set([20, 9, 6]),
            missing: new Set([0, 4, 8, 12, 16, 1, 5, 13, 17, 21, 2, 10, 14, 18, 22, 26, 30, 34]),
            maybe: new Set([]),
            maybeGroups: new Map(),
        },
        {
            has: new Set([10, 26, 0]),
            missing: new Set([4, 21, 2, 8, 13, 12, 22, 17, 20, 9, 6, 16, 14, 18, 30, 34, 1, 5]),
            maybe: new Set([]),
            maybeGroups: new Map(),
        },
        {
            has: new Set([12, 13, 21]),
            missing: new Set([16, 9, 30, 8, 17, 22, 20, 6, 10, 0, 1, 5, 14, 18, 26, 34, 2, 4]),
            maybe: new Set([]),
            maybeGroups: new Map(),
        },
        {
            has: new Set([8, 16, 5]),
            missing: new Set([20, 17, 10, 9, 6, 12, 0, 4, 1, 13, 21, 14, 18, 22, 26, 34, 30, 2]),
            maybe: new Set([]),
            maybeGroups: new Map(),
        },
        {
            has: new Set([1, 2]),
            missing: new Set([20, 17, 10, 0, 14, 9, 6, 12, 8, 13, 16, 26, 5, 4, 21]),
            maybe: new Set([]),
            maybeGroups: new Map(),
        },
        {
            has: new Set([14]),
            missing: new Set([4, 21, 2, 20, 17, 10, 8, 13, 0, 5, 9, 6, 12, 16, 1, 26]),
            maybe: new Set([]),
            maybeGroups: new Map(),
        },
    ],
};
