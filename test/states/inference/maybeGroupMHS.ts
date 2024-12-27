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
                    { player: 3, cardType: -2, card: -1 },
                    { player: 4, cardType: 0, card: 0, source: 1 },
                ],
            },
            {
                player: 1,
                cards: [1, 1, 1],
                responses: [
                    { player: 2, cardType: -2, card: -1 },
                    { player: 3, cardType: -2, card: -1 },
                    { player: 4, cardType: -1, card: -1 },
                ],
            },
            {
                player: 2,
                cards: [1, 4, 6],
                responses: [
                    { player: 3, cardType: -2, card: -1 },
                    { player: 4, cardType: -1, card: -1 },
                ],
            },
            { player: 3, cards: [3, 4, 4], responses: [{ player: 4, cardType: -1, card: -1 }] },
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
            ],
            new Set([0]),
        ],
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
                    missing: new Set([0, 1, 2, 4, 5, 6]),
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
                    has: new Set([0]),
                    missing: new Set([]),
                    maybe: new Set([4, 5, 6]),
                    maybeGroups: new Map([[1, new Set([4, 5, 6])]]),
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
                    missing: new Set([0, 1, 2, 4, 5, 6]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 4, 5, 6, 17, 26]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([0]),
                    missing: new Set([]),
                    maybe: new Set([4, 5, 6, 17, 26]),
                    maybeGroups: new Map([
                        [1, new Set([4, 5, 6])],
                        [2, new Set([4, 17, 26])],
                    ]),
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
                    missing: new Set([0, 1, 2, 4, 5, 6]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 4, 5, 6, 17, 26]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([0]),
                    missing: new Set([8, 16, 20, 1, 9, 13, 21, 2, 10, 14, 22, 26, 30, 34]),
                    maybe: new Set([4, 5, 6, 17, 12, 18]),
                    maybeGroups: new Map([
                        [1, new Set([4, 5, 6])],
                        [2, new Set([4, 17])],
                        [3, new Set([12, 17, 18])],
                    ]),
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
    ],
};
