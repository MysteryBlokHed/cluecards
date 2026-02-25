export default {
    input: {
        players: 6,
        playerCardCounts: [3, 3, 3, 3, 3, 3],
        knowns: [
            { type: 'innocent', cardType: 0, card: 0, player: 0, source: 0 },
            { type: 'innocent', cardType: 1, card: 0, player: 0, source: 0 },
            { type: 'innocent', cardType: 2, card: 0, player: 0, source: 0 },
        ],
        suggestions: [
            {
                player: 1,
                cards: [1, 1, 0],
                responses: [
                    { player: 2, cardType: -2, card: -1 },
                    { player: 3, cardType: -2, card: -1 },
                    { player: 4, cardType: -2, card: -1 },
                    { player: 5, cardType: -2, card: -1 },
                    { player: 0, cardType: 2, card: 0, source: 0 },
                ],
            },
            {
                player: 1,
                cards: [2, 2, 0],
                responses: [
                    { player: 2, cardType: -2, card: -1 },
                    { player: 3, cardType: -2, card: -1 },
                    { player: 4, cardType: -2, card: -1 },
                    { player: 5, cardType: -2, card: -1 },
                    { player: 0, cardType: 2, card: 0, source: 0 },
                ],
            },
            {
                player: 0,
                cards: [0, 0, 4],
                responses: [{ player: 1, cardType: 2, card: 4, source: 1 }],
            },
        ],
        firstIsSelf: true,
    },
    output: [
        [
            [
                {
                    has: new Set([0, 1, 2]),
                    missing: new Set([
                        4, 5, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18, 20, 21, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 4, 5]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 4, 5]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 4, 5]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 4, 5]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([0, 1, 2]),
        ],
        [
            [
                {
                    has: new Set([0, 1, 2]),
                    missing: new Set([
                        4, 5, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18, 20, 21, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 4, 5, 8, 9]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 4, 5, 8, 9]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 4, 5, 8, 9]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 4, 5, 8, 9]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([0, 1, 2]),
        ],
        [
            [
                {
                    has: new Set([0, 1, 2]),
                    missing: new Set([
                        4, 5, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18, 20, 21, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([18]),
                    missing: new Set([0, 1, 2, 6, 10, 12, 13, 14, 16, 17, 20, 21, 22, 26, 30, 34]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 4, 5, 8, 9, 18]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 4, 5, 8, 9, 18]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 4, 5, 8, 9, 18]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 4, 5, 8, 9, 18]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([0, 1, 2, 18]),
        ],
    ],
};
