export default {
    input: {
        players: 5,
        playerCardCounts: [4, 4, 4, 3, 3],
        knowns: [
            { type: 'innocent', cardType: 0, card: 0, player: 0, source: 0 },
            { type: 'innocent', cardType: 0, card: 1, player: 0, source: 0 },
            { type: 'innocent', cardType: 0, card: 2, player: 0, source: 0 },
            { type: 'innocent', cardType: 0, card: 3, player: 0, source: 0 },
        ],
        suggestions: [
            {
                player: 4,
                cards: [4, 0, 0],
                responses: [
                    { player: 0, cardType: -2, card: -1 },
                    { player: 1, cardType: -2, card: -1 },
                    { player: 2, cardType: -2, card: -1 },
                    { player: 3, cardType: -2, card: -1 },
                ],
            },
            {
                player: 0,
                cards: [5, 0, 0],
                responses: [
                    { player: 1, cardType: -2, card: -1 },
                    { player: 2, cardType: -2, card: -1 },
                    { player: 3, cardType: -2, card: -1 },
                    { player: 4, cardType: -2, card: -1 },
                ],
            },
        ],
        firstIsSelf: true,
    },
    output: [
        [
            [
                {
                    has: new Set([0, 4, 8, 12]),
                    missing: new Set([
                        16, 20, 1, 5, 9, 13, 17, 21, 2, 6, 10, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 2, 0, 4, 8, 12]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 2, 0, 4, 8, 12]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 2, 0, 4, 8, 12]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 4, 8, 12]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([0, 4, 8, 12]),
        ],
        [
            [
                {
                    has: new Set([0, 4, 8, 12]),
                    missing: new Set([
                        16, 20, 1, 5, 9, 13, 17, 21, 2, 6, 10, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 2, 20, 0, 4, 8, 12]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 2, 20, 0, 4, 8, 12]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 2, 20, 0, 4, 8, 12]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([16]),
                    missing: new Set([20, 1, 2, 0, 4, 8, 12]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([0, 4, 8, 12, 16]),
        ],
    ],
};
