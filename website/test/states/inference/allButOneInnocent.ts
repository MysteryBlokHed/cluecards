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
                player: 0,
                cards: [4, 0, 0],
                responses: [{ player: 1, cardType: 0, card: 4, source: 1 }],
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
                    has: new Set([16]),
                    missing: new Set([0, 4, 8, 12, 20]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 4, 8, 12, 16, 20]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 4, 8, 12, 16, 20]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([0, 4, 8, 12, 16, 20]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([0, 4, 8, 12, 16]),
        ],
    ],
};
