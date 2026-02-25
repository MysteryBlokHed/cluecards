export default {
    input: {
        players: 6,
        playerCardCounts: [3, 3, 3, 3, 3, 3],
        knowns: [],
        suggestions: [
            {
                player: 5,
                cards: [0, 0, 0],
                responses: [{ player: 0, cardType: 0, card: 0, source: 0 }],
            },
            { player: 0, cards: [0, 1, 1], responses: [{ player: 1, cardType: -1, card: -1 }] },
            { player: 1, cards: [0, 1, 1], responses: [{ player: 2, cardType: -1, card: -1 }] },
        ],
        firstIsSelf: false,
    },
    output: [
        [
            [
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
                    has: new Set([0]),
                    missing: new Set([]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0]),
                    maybe: new Set([5, 6]),
                    maybeGroups: new Map([[1, new Set([5, 6])]]),
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
                    has: new Set([0]),
                    missing: new Set([5, 6]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0]),
                    maybe: new Set([5, 6]),
                    maybeGroups: new Map([[1, new Set([5, 6])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0]),
                    maybe: new Set([5, 6]),
                    maybeGroups: new Map([[2, new Set([5, 6])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 5, 6]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 5, 6]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 5, 6]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([0]),
        ],
    ],
};
