export default {
    input: {
        players: 6,
        playerCardCounts: [3, 3, 3, 3, 3, 3],
        knowns: [],
        suggestions: [
            {
                player: 0,
                cards: [0, 0, 0],
                responses: [
                    { player: 1, cardType: -2, card: -1 },
                    { player: 2, cardType: -2, card: -1 },
                    { player: 3, cardType: 0, card: 0, source: 1 },
                ],
            },
            {
                player: 1,
                cards: [1, 1, 1],
                responses: [
                    { player: 2, cardType: -2, card: -1 },
                    { player: 3, cardType: 1, card: 1, source: 1 },
                ],
            },
            {
                player: 2,
                cards: [2, 2, 2],
                responses: [{ player: 3, cardType: 2, card: 2, source: 1 }],
            },
        ],
        firstIsSelf: false,
    },
    output: [
        [
            [
                {
                    has: new Set([]),
                    missing: new Set([0]),
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
                    missing: new Set([0, 1, 2]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([0]),
                    missing: new Set([]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([0]),
        ],
        [
            [
                {
                    has: new Set([]),
                    missing: new Set([0, 5]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 5]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 4, 5, 6]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([0, 5]),
                    missing: new Set([]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 5]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 5]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([0, 5]),
        ],
        [
            [
                {
                    has: new Set([]),
                    missing: new Set([0, 5, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 5, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 4, 5, 6, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([0, 5, 10]),
                    missing: new Set([
                        4, 8, 12, 16, 20, 1, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 5, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 5, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([0, 5, 10]),
        ],
    ],
};
