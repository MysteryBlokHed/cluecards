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
                    { player: 2, cardType: 0, card: 0, source: 1 },
                ],
            },
            {
                player: 0,
                cards: [1, 1, 1],
                responses: [
                    { player: 1, cardType: -2, card: -1 },
                    { player: 2, cardType: 1, card: 1, source: 1 },
                ],
            },
            {
                player: 0,
                cards: [2, 2, 2],
                responses: [
                    { player: 1, cardType: -2, card: -1 },
                    { player: 2, cardType: -2, card: -1 },
                    { player: 3, cardType: 0, card: 2, source: 1 },
                ],
            },
            {
                player: 0,
                cards: [3, 3, 3],
                responses: [
                    { player: 1, cardType: -2, card: -1 },
                    { player: 2, cardType: -2, card: -1 },
                    { player: 3, cardType: 1, card: 3, source: 1 },
                ],
            },
            {
                player: 0,
                cards: [4, 4, 4],
                responses: [
                    { player: 1, cardType: -2, card: -1 },
                    { player: 2, cardType: -2, card: -1 },
                    { player: 3, cardType: -2, card: -1 },
                    { player: 4, cardType: 0, card: 4, source: 1 },
                ],
            },
            {
                player: 0,
                cards: [5, 5, 5],
                responses: [
                    { player: 1, cardType: -2, card: -1 },
                    { player: 2, cardType: -2, card: -1 },
                    { player: 3, cardType: -2, card: -1 },
                    { player: 4, cardType: 1, card: 5, source: 1 },
                ],
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
                    missing: new Set([0, 5, 8]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 4, 5, 6, 8, 9, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([0, 5]),
                    missing: new Set([8, 9, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([8]),
                    missing: new Set([0, 5]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 5, 8]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 5, 8]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([0, 5, 8]),
        ],
        [
            [
                {
                    has: new Set([]),
                    missing: new Set([0, 5, 8, 13]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([0, 5]),
                    missing: new Set([8, 9, 10, 12, 13, 14]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([8, 13]),
                    missing: new Set([0, 5]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 5, 8, 13]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 5, 8, 13]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([0, 5, 8, 13]),
        ],
        [
            [
                {
                    has: new Set([]),
                    missing: new Set([0, 5, 8, 13, 16]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([0, 5]),
                    missing: new Set([8, 9, 10, 12, 13, 14, 16, 17, 18]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([8, 13]),
                    missing: new Set([16, 17, 18, 0, 5]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([16]),
                    missing: new Set([0, 5, 8, 13]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 5, 8, 13, 16]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([0, 5, 8, 13, 16]),
        ],
        [
            [
                {
                    has: new Set([]),
                    missing: new Set([26, 30, 34, 0, 5, 8, 13, 16, 21]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([26, 30, 34]),
                    missing: new Set([
                        0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18, 20, 21, 22,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([0, 5]),
                    missing: new Set([8, 9, 10, 12, 13, 14, 16, 17, 18, 20, 21, 22, 26, 30, 34]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([8, 13]),
                    missing: new Set([16, 17, 18, 20, 21, 22, 26, 30, 34, 0, 5]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([16, 21]),
                    missing: new Set([26, 30, 34, 0, 5, 8, 13]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([26, 30, 34, 0, 5, 8, 13, 16, 21]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([26, 30, 34, 0, 5, 8, 13, 16, 21]),
        ],
    ],
};
