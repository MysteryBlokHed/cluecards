export default {
    input: {
        players: 6,
        playerCardCounts: [3, 3, 3, 3, 3, 3],
        knowns: [],
        suggestions: [
            {
                player: 1,
                cards: [2, 3, 2],
                responses: [
                    { player: 2, cardType: -2, card: -1 },
                    { player: 3, cardType: -2, card: -1 },
                    { player: 4, cardType: -1, card: -1 },
                ],
            },
            {
                player: 2,
                cards: [1, 0, 0],
                responses: [
                    { player: 3, cardType: -2, card: -1 },
                    { player: 4, cardType: -1, card: -1 },
                ],
            },
            { player: 3, cards: [0, 1, 0], responses: [{ player: 4, cardType: -1, card: -1 }] },
            {
                player: 1,
                cards: [3, 1, 2],
                responses: [
                    { player: 2, cardType: -2, card: -1 },
                    { player: 3, cardType: -2, card: -1 },
                    { player: 4, cardType: -1, card: -1 },
                ],
            },
            {
                player: 2,
                cards: [1, 3, 5],
                responses: [
                    { player: 3, cardType: -2, card: -1 },
                    { player: 4, cardType: -1, card: -1 },
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
                    missing: new Set([]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([8, 10, 13]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([8, 10, 13]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([]),
                    maybe: new Set([8, 10, 13]),
                    maybeGroups: new Map([[0, new Set([8, 10, 13])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([]),
        ],
        [
            [
                {
                    has: new Set([]),
                    missing: new Set([]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([8, 10, 13]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([1, 2, 4, 8, 10, 13]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([]),
                    maybe: new Set([1, 2, 4, 8, 10, 13]),
                    maybeGroups: new Map([
                        [0, new Set([8, 10, 13])],
                        [1, new Set([1, 2, 4])],
                    ]),
                },
                {
                    has: new Set([]),
                    missing: new Set([]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([]),
        ],
        [
            [
                {
                    has: new Set([]),
                    missing: new Set([]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([8, 10, 13]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([1, 2, 4, 8, 10, 13]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([]),
                    maybe: new Set([0, 1, 2, 4, 5, 8, 10, 13]),
                    maybeGroups: new Map([
                        [0, new Set([8, 10, 13])],
                        [1, new Set([1, 2, 4])],
                        [2, new Set([0, 2, 5])],
                    ]),
                },
                {
                    has: new Set([]),
                    missing: new Set([]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([]),
        ],
        [
            [
                {
                    has: new Set([]),
                    missing: new Set([]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([5, 8, 10, 12, 13]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([1, 2, 4, 5, 8, 10, 12, 13]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([]),
                    maybe: new Set([0, 1, 2, 4, 5, 8, 10, 12, 13]),
                    maybeGroups: new Map([
                        [0, new Set([8, 10, 13])],
                        [1, new Set([1, 2, 4])],
                        [2, new Set([0, 2, 5])],
                        [3, new Set([5, 10, 12])],
                    ]),
                },
                {
                    has: new Set([]),
                    missing: new Set([]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([]),
        ],
        [
            [
                {
                    has: new Set([]),
                    missing: new Set([]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([5, 8, 10, 12, 13]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([1, 2, 4, 5, 8, 10, 12, 13, 22]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([6, 9, 14, 16, 17, 18, 20, 21, 26, 30, 34]),
                    maybe: new Set([0, 1, 2, 4, 5, 8, 10, 12, 13, 22]),
                    maybeGroups: new Map([
                        [0, new Set([8, 10, 13])],
                        [1, new Set([1, 2, 4])],
                        [2, new Set([0, 2, 5])],
                        [3, new Set([5, 10, 12])],
                        [4, new Set([4, 13, 22])],
                    ]),
                },
                {
                    has: new Set([]),
                    missing: new Set([]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([]),
        ],
    ],
};
