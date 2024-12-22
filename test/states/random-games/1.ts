export default {
    input: {
        players: 6,
        playerCardCounts: [3, 3, 3, 3, 3, 3],
        knowns: [
            { type: 'innocent', cardType: 0, card: 4, player: 0, source: 0 },
            { type: 'innocent', cardType: 1, card: 0, player: 0, source: 0 },
            { type: 'innocent', cardType: 2, card: 2, player: 0, source: 0 },
        ],
        suggestions: [
            { player: 2, cards: [5, 0, 5], responses: [{ player: 3, cardType: -1, card: -1 }] },
            { player: 3, cards: [3, 3, 4], responses: [{ player: 4, cardType: -1, card: -1 }] },
            {
                player: 4,
                cards: [3, 5, 6],
                responses: [
                    { player: 5, cardType: -2, card: -1 },
                    { player: 0, cardType: -2, card: -1 },
                    { player: 1, cardType: -2, card: -1 },
                    { player: 2, cardType: -1, card: -1 },
                ],
            },
            {
                player: 5,
                cards: [2, 1, 5],
                responses: [
                    { player: 0, cardType: -2, card: -1 },
                    { player: 1, cardType: -2, card: -1 },
                    { player: 2, cardType: -1, card: -1 },
                ],
            },
            {
                player: 0,
                cards: [5, 3, 4],
                responses: [
                    { player: 1, cardType: -2, card: -1 },
                    { player: 2, cardType: -2, card: -1 },
                    { player: 3, cardType: 1, card: 3, source: 1 },
                ],
            },
            {
                player: 1,
                cards: [1, 4, 7],
                responses: [
                    { player: 2, cardType: -2, card: -1 },
                    { player: 3, cardType: -1, card: -1 },
                ],
            },
            {
                player: 2,
                cards: [1, 2, 0],
                responses: [
                    { player: 3, cardType: -2, card: -1 },
                    { player: 4, cardType: -2, card: -1 },
                    { player: 5, cardType: -1, card: -1 },
                ],
            },
            {
                player: 3,
                cards: [4, 0, 8],
                responses: [
                    { player: 4, cardType: -2, card: -1 },
                    { player: 5, cardType: -2, card: -1 },
                    { player: 0, cardType: 0, card: 4, source: 0 },
                ],
            },
            {
                player: 4,
                cards: [0, 0, 8],
                responses: [
                    { player: 5, cardType: -2, card: -1 },
                    { player: 0, cardType: 1, card: 0, source: 0 },
                ],
            },
            {
                player: 5,
                cards: [0, 5, 6],
                responses: [
                    { player: 0, cardType: -2, card: -1 },
                    { player: 1, cardType: -1, card: -1 },
                ],
            },
            {
                player: 0,
                cards: [5, 2, 1],
                responses: [
                    { player: 1, cardType: -2, card: -1 },
                    { player: 2, cardType: -2, card: -1 },
                    { player: 3, cardType: 0, card: 5, source: 1 },
                ],
            },
            {
                player: 1,
                cards: [5, 3, 5],
                responses: [
                    { player: 2, cardType: -2, card: -1 },
                    { player: 3, cardType: -1, card: -1 },
                ],
            },
            { player: 2, cards: [3, 4, 2], responses: [{ player: 3, cardType: -1, card: -1 }] },
            {
                player: 3,
                cards: [2, 0, 7],
                responses: [
                    { player: 4, cardType: -2, card: -1 },
                    { player: 5, cardType: -2, card: -1 },
                    { player: 0, cardType: 1, card: 0, source: 0 },
                ],
            },
            {
                player: 4,
                cards: [4, 5, 6],
                responses: [
                    { player: 5, cardType: -2, card: -1 },
                    { player: 0, cardType: 0, card: 4, source: 0 },
                ],
            },
            {
                player: 5,
                cards: [3, 5, 1],
                responses: [
                    { player: 0, cardType: -2, card: -1 },
                    { player: 1, cardType: -2, card: -1 },
                    { player: 2, cardType: -1, card: -1 },
                ],
            },
            {
                player: 0,
                cards: [3, 2, 0],
                responses: [{ player: 1, cardType: 2, card: 0, source: 1 }],
            },
            {
                player: 1,
                cards: [1, 3, 3],
                responses: [
                    { player: 2, cardType: -2, card: -1 },
                    { player: 3, cardType: -1, card: -1 },
                ],
            },
            { player: 2, cards: [2, 3, 3], responses: [{ player: 3, cardType: -1, card: -1 }] },
            { player: 3, cards: [1, 1, 2], responses: [{ player: 4, cardType: -1, card: -1 }] },
            {
                player: 4,
                cards: [1, 5, 8],
                responses: [
                    { player: 5, cardType: -2, card: -1 },
                    { player: 0, cardType: -2, card: -1 },
                    { player: 1, cardType: -2, card: -1 },
                    { player: 2, cardType: -1, card: -1 },
                ],
            },
            {
                player: 5,
                cards: [1, 5, 2],
                responses: [{ player: 0, cardType: 2, card: 2, source: 0 }],
            },
            {
                player: 0,
                cards: [1, 5, 6],
                responses: [
                    { player: 1, cardType: -2, card: -1 },
                    { player: 2, cardType: -2, card: -1 },
                    { player: 3, cardType: -2, card: -1 },
                    { player: 4, cardType: -2, card: -1 },
                    { player: 5, cardType: -2, card: -1 },
                ],
            },
        ],
        firstIsSelf: true,
    },
    output: [
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 10]),
                    maybe: new Set([20, 22]),
                    maybeGroups: new Map([[0, new Set([20, 22])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([16, 1, 10]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 10]),
                    maybe: new Set([20, 22]),
                    maybeGroups: new Map([[0, new Set([20, 22])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 10]),
                    maybe: new Set([12, 13, 18]),
                    maybeGroups: new Map([[1, new Set([12, 13, 18])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([16, 1, 10]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 16, 1, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 10]),
                    maybe: new Set([12, 21, 26]),
                    maybeGroups: new Map([[2, new Set([12, 21, 26])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 10]),
                    maybe: new Set([20, 22]),
                    maybeGroups: new Map([[0, new Set([20, 22])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 10]),
                    maybe: new Set([12, 13, 18]),
                    maybeGroups: new Map([[1, new Set([12, 13, 18])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 16, 1, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([16, 1, 10]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 8, 5, 22, 16, 1, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 10]),
                    maybe: new Set([12, 21, 26, 8, 5, 22]),
                    maybeGroups: new Map([
                        [2, new Set([12, 21, 26])],
                        [3, new Set([8, 5, 22])],
                    ]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 10]),
                    maybe: new Set([20, 22]),
                    maybeGroups: new Map([[0, new Set([20, 22])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 10]),
                    maybe: new Set([12, 13, 18]),
                    maybeGroups: new Map([[1, new Set([12, 13, 18])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 16, 1, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([16, 1, 10]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 8, 5, 22, 20, 13, 18, 16, 1, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([20, 13, 18, 16, 1, 10]),
                    maybe: new Set([12, 21, 26, 8, 5, 22]),
                    maybeGroups: new Map([
                        [2, new Set([12, 21, 26])],
                        [3, new Set([8, 5, 22])],
                    ]),
                },
                {
                    has: new Set([13]),
                    missing: new Set([16, 1, 10]),
                    maybe: new Set([20, 22]),
                    maybeGroups: new Map([[0, new Set([20, 22])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 10, 13]),
                    maybe: new Set([12, 18]),
                    maybeGroups: new Map([[1, new Set([12, 18])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 16, 1, 10, 13]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([16, 1, 10, 13]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 8, 5, 22, 20, 13, 18, 16, 1, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([20, 13, 18, 4, 17, 30, 16, 1, 10]),
                    maybe: new Set([12, 21, 26, 8, 5, 22]),
                    maybeGroups: new Map([
                        [2, new Set([12, 21, 26])],
                        [3, new Set([8, 5, 22])],
                    ]),
                },
                {
                    has: new Set([13]),
                    missing: new Set([16, 1, 10, 0, 8, 12, 5, 9, 21, 2, 6, 14, 18, 26, 34]),
                    maybe: new Set([20, 22, 4, 17, 30]),
                    maybeGroups: new Map([
                        [0, new Set([20, 22])],
                        [5, new Set([4, 17, 30])],
                    ]),
                },
                {
                    has: new Set([]),
                    missing: new Set([16, 1, 10, 13]),
                    maybe: new Set([12, 18]),
                    maybeGroups: new Map([[1, new Set([12, 18])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 16, 1, 10, 13]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([16, 1, 10, 13]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 8, 5, 22, 20, 13, 18, 16, 1, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([20, 13, 18, 4, 17, 30, 16, 1, 10]),
                    maybe: new Set([12, 21, 26, 8, 5, 22]),
                    maybeGroups: new Map([
                        [2, new Set([12, 21, 26])],
                        [3, new Set([8, 5, 22])],
                    ]),
                },
                {
                    has: new Set([13]),
                    missing: new Set([4, 9, 2, 16, 1, 10, 0, 8, 12, 5, 21, 6, 14, 18, 26, 34]),
                    maybe: new Set([20, 22, 17, 30]),
                    maybeGroups: new Map([
                        [0, new Set([20, 22])],
                        [5, new Set([17, 30])],
                    ]),
                },
                {
                    has: new Set([]),
                    missing: new Set([4, 9, 2, 16, 1, 10, 13]),
                    maybe: new Set([12, 18]),
                    maybeGroups: new Map([[1, new Set([12, 18])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 16, 1, 10, 13]),
                    maybe: new Set([4, 9, 2]),
                    maybeGroups: new Map([[6, new Set([4, 9, 2])]]),
                },
            ],
            new Set([16, 1, 10, 13]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 8, 5, 22, 20, 13, 18, 16, 1, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([20, 13, 18, 4, 17, 30, 16, 1, 10]),
                    maybe: new Set([12, 21, 26, 8, 5, 22]),
                    maybeGroups: new Map([
                        [2, new Set([12, 21, 26])],
                        [3, new Set([8, 5, 22])],
                    ]),
                },
                {
                    has: new Set([13]),
                    missing: new Set([4, 9, 2, 16, 1, 10, 0, 8, 12, 5, 21, 6, 14, 18, 26, 34]),
                    maybe: new Set([20, 22, 17, 30]),
                    maybeGroups: new Map([
                        [0, new Set([20, 22])],
                        [5, new Set([17, 30])],
                    ]),
                },
                {
                    has: new Set([]),
                    missing: new Set([4, 9, 2, 16, 1, 34, 10, 13]),
                    maybe: new Set([12, 18]),
                    maybeGroups: new Map([[1, new Set([12, 18])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 16, 1, 34, 10, 13]),
                    maybe: new Set([4, 9, 2]),
                    maybeGroups: new Map([[6, new Set([4, 9, 2])]]),
                },
            ],
            new Set([16, 1, 10, 13]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 8, 5, 22, 20, 13, 18, 16, 1, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([20, 13, 18, 4, 17, 30, 16, 1, 10]),
                    maybe: new Set([12, 21, 26, 8, 5, 22]),
                    maybeGroups: new Map([
                        [2, new Set([12, 21, 26])],
                        [3, new Set([8, 5, 22])],
                    ]),
                },
                {
                    has: new Set([13]),
                    missing: new Set([4, 9, 2, 16, 1, 10, 0, 8, 12, 5, 21, 6, 14, 18, 26, 34]),
                    maybe: new Set([20, 22, 17, 30]),
                    maybeGroups: new Map([
                        [0, new Set([20, 22])],
                        [5, new Set([17, 30])],
                    ]),
                },
                {
                    has: new Set([]),
                    missing: new Set([4, 9, 2, 16, 1, 34, 10, 13]),
                    maybe: new Set([12, 18]),
                    maybeGroups: new Map([[1, new Set([12, 18])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 16, 1, 34, 0, 10, 13]),
                    maybe: new Set([4, 9, 2]),
                    maybeGroups: new Map([[6, new Set([4, 9, 2])]]),
                },
            ],
            new Set([16, 1, 10, 13]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([0]),
                    missing: new Set([12, 21, 26, 8, 5, 22, 20, 13, 18, 16, 1, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([20, 13, 18, 4, 17, 30, 16, 1, 10, 0]),
                    maybe: new Set([12, 21, 26, 8, 5, 22]),
                    maybeGroups: new Map([
                        [2, new Set([12, 21, 26])],
                        [3, new Set([8, 5, 22])],
                    ]),
                },
                {
                    has: new Set([13]),
                    missing: new Set([4, 9, 2, 16, 1, 10, 0, 8, 12, 5, 21, 6, 14, 18, 26, 34]),
                    maybe: new Set([20, 22, 17, 30]),
                    maybeGroups: new Map([
                        [0, new Set([20, 22])],
                        [5, new Set([17, 30])],
                    ]),
                },
                {
                    has: new Set([]),
                    missing: new Set([4, 9, 2, 16, 1, 34, 10, 13, 0]),
                    maybe: new Set([12, 18]),
                    maybeGroups: new Map([[1, new Set([12, 18])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 16, 1, 34, 0, 10, 13]),
                    maybe: new Set([4, 9, 2]),
                    maybeGroups: new Map([[6, new Set([4, 9, 2])]]),
                },
            ],
            new Set([16, 1, 10, 0, 13]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([0]),
                    missing: new Set([12, 21, 26, 8, 5, 22, 20, 13, 18, 9, 6, 16, 1, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([20, 13, 18, 4, 17, 30, 9, 6, 16, 1, 10, 0]),
                    maybe: new Set([12, 21, 26, 8, 5, 22]),
                    maybeGroups: new Map([
                        [2, new Set([12, 21, 26])],
                        [3, new Set([8, 5, 22])],
                    ]),
                },
                {
                    has: new Set([13, 20]),
                    missing: new Set([4, 9, 2, 16, 1, 10, 0, 8, 12, 5, 21, 6, 14, 18, 22, 26, 34]),
                    maybe: new Set([17, 30]),
                    maybeGroups: new Map([[5, new Set([17, 30])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([4, 9, 2, 16, 1, 34, 10, 13, 20, 0]),
                    maybe: new Set([12, 18]),
                    maybeGroups: new Map([[1, new Set([12, 18])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 16, 1, 34, 0, 10, 13, 20]),
                    maybe: new Set([4, 9, 2]),
                    maybeGroups: new Map([[6, new Set([4, 9, 2])]]),
                },
            ],
            new Set([16, 1, 10, 0, 13, 20]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([0]),
                    missing: new Set([12, 21, 26, 8, 5, 22, 20, 13, 18, 9, 6, 16, 1, 10]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([20, 13, 18, 4, 17, 30, 9, 6, 22, 16, 1, 10, 0]),
                    maybe: new Set([12, 21, 26, 8, 5]),
                    maybeGroups: new Map([
                        [2, new Set([12, 21, 26])],
                        [3, new Set([8, 5])],
                    ]),
                },
                {
                    has: new Set([13, 20]),
                    missing: new Set([4, 9, 2, 16, 1, 10, 0, 8, 12, 5, 21, 6, 14, 18, 22, 26, 34]),
                    maybe: new Set([17, 30]),
                    maybeGroups: new Map([[5, new Set([17, 30])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([4, 9, 2, 16, 1, 34, 10, 13, 20, 0]),
                    maybe: new Set([12, 18]),
                    maybeGroups: new Map([[1, new Set([12, 18])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 16, 1, 34, 0, 10, 13, 20]),
                    maybe: new Set([4, 9, 2]),
                    maybeGroups: new Map([[6, new Set([4, 9, 2])]]),
                },
            ],
            new Set([16, 1, 10, 0, 13, 20]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([0]),
                    missing: new Set([12, 21, 26, 8, 5, 22, 20, 13, 18, 9, 6, 16, 1, 10, 17]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([20, 13, 18, 4, 17, 30, 9, 6, 22, 16, 1, 10, 0]),
                    maybe: new Set([12, 21, 26, 8, 5]),
                    maybeGroups: new Map([
                        [2, new Set([12, 21, 26])],
                        [3, new Set([8, 5])],
                    ]),
                },
                {
                    has: new Set([13, 20, 17]),
                    missing: new Set([
                        4, 9, 2, 16, 1, 10, 0, 8, 12, 5, 21, 6, 14, 18, 22, 26, 34, 30,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([4, 9, 2, 16, 1, 34, 10, 13, 20, 0, 17]),
                    maybe: new Set([12, 18]),
                    maybeGroups: new Map([[1, new Set([12, 18])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 16, 1, 34, 0, 10, 13, 20, 17]),
                    maybe: new Set([4, 9, 2]),
                    maybeGroups: new Map([[6, new Set([4, 9, 2])]]),
                },
            ],
            new Set([16, 1, 10, 0, 13, 20, 17]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([0]),
                    missing: new Set([12, 21, 26, 8, 5, 22, 20, 13, 18, 9, 6, 16, 1, 10, 17]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([20, 13, 18, 4, 17, 30, 9, 6, 22, 16, 1, 10, 0]),
                    maybe: new Set([12, 21, 26, 8, 5]),
                    maybeGroups: new Map([
                        [2, new Set([12, 21, 26])],
                        [3, new Set([8, 5])],
                    ]),
                },
                {
                    has: new Set([13, 20, 17]),
                    missing: new Set([
                        4, 9, 2, 16, 1, 10, 0, 8, 12, 5, 21, 6, 14, 18, 22, 26, 34, 30,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([4, 9, 2, 16, 1, 34, 8, 30, 10, 13, 20, 0, 17]),
                    maybe: new Set([12, 18]),
                    maybeGroups: new Map([[1, new Set([12, 18])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 16, 1, 34, 0, 8, 30, 10, 13, 20, 17]),
                    maybe: new Set([4, 9, 2]),
                    maybeGroups: new Map([[6, new Set([4, 9, 2])]]),
                },
            ],
            new Set([16, 1, 10, 0, 13, 20, 17]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([0]),
                    missing: new Set([12, 21, 26, 8, 5, 22, 20, 13, 18, 9, 6, 16, 1, 10, 17]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([20, 13, 18, 4, 17, 30, 9, 6, 22, 16, 1, 10, 0]),
                    maybe: new Set([12, 21, 26, 8, 5]),
                    maybeGroups: new Map([
                        [2, new Set([12, 21, 26])],
                        [3, new Set([8, 5])],
                    ]),
                },
                {
                    has: new Set([13, 20, 17]),
                    missing: new Set([
                        4, 9, 2, 16, 1, 10, 0, 8, 12, 5, 21, 6, 14, 18, 22, 26, 34, 30,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([4, 9, 2, 16, 1, 34, 8, 30, 10, 13, 20, 0, 17]),
                    maybe: new Set([12, 18]),
                    maybeGroups: new Map([[1, new Set([12, 18])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 16, 1, 34, 0, 8, 30, 10, 13, 20, 17]),
                    maybe: new Set([4, 9, 2]),
                    maybeGroups: new Map([[6, new Set([4, 9, 2])]]),
                },
            ],
            new Set([16, 1, 10, 0, 13, 20, 17]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([0]),
                    missing: new Set([12, 21, 26, 8, 5, 22, 20, 13, 18, 9, 6, 16, 1, 10, 17]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([20, 13, 18, 4, 17, 30, 9, 6, 22, 16, 1, 10, 0]),
                    maybe: new Set([12, 21, 26, 8, 5]),
                    maybeGroups: new Map([
                        [2, new Set([12, 21, 26])],
                        [3, new Set([8, 5])],
                        [15, new Set([12, 21])],
                    ]),
                },
                {
                    has: new Set([13, 20, 17]),
                    missing: new Set([
                        4, 9, 2, 16, 1, 10, 0, 8, 12, 5, 21, 6, 14, 18, 22, 26, 34, 30,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([4, 9, 2, 16, 1, 34, 8, 30, 10, 13, 20, 0, 17]),
                    maybe: new Set([12, 18]),
                    maybeGroups: new Map([[1, new Set([12, 18])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 16, 1, 34, 0, 8, 30, 10, 13, 20, 17]),
                    maybe: new Set([4, 9, 2]),
                    maybeGroups: new Map([[6, new Set([4, 9, 2])]]),
                },
            ],
            new Set([16, 1, 10, 0, 13, 20, 17]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([2, 0]),
                    missing: new Set([12, 21, 26, 8, 5, 22, 20, 13, 18, 9, 6, 16, 1, 10, 17]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([20, 13, 18, 4, 17, 30, 9, 6, 22, 16, 1, 10, 2, 0]),
                    maybe: new Set([12, 21, 26, 8, 5]),
                    maybeGroups: new Map([
                        [2, new Set([12, 21, 26])],
                        [3, new Set([8, 5])],
                        [15, new Set([12, 21])],
                    ]),
                },
                {
                    has: new Set([13, 20, 17]),
                    missing: new Set([
                        4, 9, 2, 16, 1, 10, 0, 8, 12, 5, 21, 6, 14, 18, 22, 26, 34, 30,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([4, 9, 2, 16, 1, 34, 8, 30, 10, 13, 20, 0, 17]),
                    maybe: new Set([12, 18]),
                    maybeGroups: new Map([[1, new Set([12, 18])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 16, 1, 34, 0, 8, 30, 10, 2, 13, 20, 17]),
                    maybe: new Set([4, 9]),
                    maybeGroups: new Map([[6, new Set([4, 9])]]),
                },
            ],
            new Set([16, 1, 10, 2, 0, 13, 20, 17]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([2, 0]),
                    missing: new Set([12, 21, 26, 8, 5, 22, 20, 13, 18, 9, 6, 16, 1, 10, 17]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([20, 13, 18, 4, 17, 30, 9, 6, 22, 14, 16, 1, 10, 2, 0]),
                    maybe: new Set([12, 21, 26, 8, 5]),
                    maybeGroups: new Map([
                        [2, new Set([12, 21, 26])],
                        [3, new Set([8, 5])],
                        [15, new Set([12, 21])],
                    ]),
                },
                {
                    has: new Set([13, 20, 17]),
                    missing: new Set([
                        4, 9, 2, 16, 1, 10, 0, 8, 12, 5, 21, 6, 14, 18, 22, 26, 34, 30,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([4, 9, 2, 16, 1, 34, 8, 30, 10, 13, 20, 0, 17]),
                    maybe: new Set([12, 18]),
                    maybeGroups: new Map([[1, new Set([12, 18])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 16, 1, 34, 0, 8, 30, 10, 2, 13, 20, 17]),
                    maybe: new Set([4, 9]),
                    maybeGroups: new Map([[6, new Set([4, 9])]]),
                },
            ],
            new Set([16, 1, 10, 2, 0, 13, 20, 17]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([2, 0]),
                    missing: new Set([12, 21, 26, 8, 5, 22, 20, 13, 18, 9, 6, 16, 1, 10, 17]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([20, 13, 18, 4, 17, 30, 9, 6, 22, 14, 16, 1, 10, 2, 0]),
                    maybe: new Set([12, 21, 26, 8, 5]),
                    maybeGroups: new Map([
                        [2, new Set([12, 21, 26])],
                        [3, new Set([8, 5])],
                        [15, new Set([12, 21])],
                    ]),
                },
                {
                    has: new Set([13, 20, 17]),
                    missing: new Set([
                        4, 9, 2, 16, 1, 10, 0, 8, 12, 5, 21, 6, 14, 18, 22, 26, 34, 30,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([]),
                    missing: new Set([4, 9, 2, 16, 1, 34, 8, 30, 10, 13, 20, 0, 17]),
                    maybe: new Set([12, 18]),
                    maybeGroups: new Map([[1, new Set([12, 18])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 16, 1, 34, 0, 8, 30, 10, 2, 13, 20, 17]),
                    maybe: new Set([4, 9]),
                    maybeGroups: new Map([[6, new Set([4, 9])]]),
                },
            ],
            new Set([16, 1, 10, 2, 0, 13, 20, 17]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([2, 0]),
                    missing: new Set([12, 21, 26, 8, 5, 22, 20, 13, 18, 9, 6, 16, 1, 10, 17]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([8]),
                    missing: new Set([20, 13, 18, 4, 17, 30, 9, 6, 22, 14, 16, 1, 10, 2, 0, 5]),
                    maybe: new Set([12, 21, 26]),
                    maybeGroups: new Map([
                        [2, new Set([12, 21, 26])],
                        [15, new Set([12, 21])],
                    ]),
                },
                {
                    has: new Set([13, 20, 17]),
                    missing: new Set([
                        4, 9, 2, 16, 1, 10, 0, 8, 12, 5, 21, 6, 14, 18, 22, 26, 34, 30,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([5]),
                    missing: new Set([4, 9, 2, 16, 1, 34, 8, 30, 10, 13, 20, 0, 17]),
                    maybe: new Set([12, 18]),
                    maybeGroups: new Map([[1, new Set([12, 18])]]),
                },
                {
                    has: new Set([]),
                    missing: new Set([12, 21, 26, 16, 1, 34, 0, 8, 30, 10, 2, 13, 20, 17, 5]),
                    maybe: new Set([4, 9]),
                    maybeGroups: new Map([[6, new Set([4, 9])]]),
                },
            ],
            new Set([16, 1, 10, 2, 0, 8, 13, 20, 17, 5]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([2, 0]),
                    missing: new Set([
                        12, 21, 26, 8, 5, 22, 20, 13, 18, 9, 6, 4, 34, 16, 1, 10, 17,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([8, 12, 34]),
                    missing: new Set([
                        20, 13, 18, 4, 17, 30, 9, 6, 22, 14, 16, 1, 10, 2, 21, 0, 5, 26,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([13, 20, 17]),
                    missing: new Set([
                        4, 9, 2, 16, 1, 10, 0, 8, 12, 5, 21, 6, 14, 18, 22, 26, 34, 30,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([5, 18]),
                    missing: new Set([4, 9, 2, 16, 1, 34, 8, 30, 10, 13, 20, 21, 0, 17, 12]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([9]),
                    missing: new Set([
                        12, 21, 26, 16, 1, 34, 0, 8, 30, 4, 10, 2, 13, 20, 17, 5, 18,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([16, 1, 10, 2, 0, 8, 12, 34, 13, 20, 17, 5, 18, 9]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([2, 0]),
                    missing: new Set([
                        12, 21, 26, 8, 5, 22, 20, 13, 18, 9, 6, 4, 34, 16, 1, 10, 17,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([8, 12, 34]),
                    missing: new Set([
                        20, 13, 18, 4, 17, 30, 9, 6, 22, 14, 16, 1, 10, 2, 21, 0, 5, 26,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([13, 20, 17]),
                    missing: new Set([
                        4, 9, 2, 16, 1, 10, 0, 8, 12, 5, 21, 6, 14, 18, 22, 26, 34, 30,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([5, 18]),
                    missing: new Set([4, 9, 2, 16, 1, 34, 8, 30, 10, 13, 20, 21, 0, 17, 12]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([9]),
                    missing: new Set([
                        12, 21, 26, 16, 1, 34, 0, 8, 30, 4, 10, 2, 13, 20, 17, 5, 18,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([16, 1, 10, 2, 0, 8, 12, 34, 13, 20, 17, 5, 18, 9]),
        ],
        [
            [
                {
                    has: new Set([16, 1, 10]),
                    missing: new Set([
                        0, 4, 8, 12, 20, 5, 9, 13, 17, 21, 2, 6, 14, 18, 22, 26, 30, 34,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([2, 0, 30]),
                    missing: new Set([
                        12, 21, 26, 8, 5, 22, 20, 13, 18, 9, 6, 4, 34, 16, 1, 10, 17, 14,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([12, 34, 8]),
                    missing: new Set([
                        20, 13, 18, 4, 17, 30, 9, 6, 22, 14, 21, 26, 16, 1, 10, 2, 0, 5,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([13, 20, 17]),
                    missing: new Set([
                        4, 9, 2, 21, 26, 16, 1, 10, 0, 8, 12, 5, 6, 14, 18, 22, 34, 30,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([5, 18]),
                    missing: new Set([4, 9, 2, 16, 1, 34, 8, 30, 21, 26, 10, 13, 20, 0, 12, 17]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
                {
                    has: new Set([9]),
                    missing: new Set([
                        12, 21, 26, 16, 1, 34, 0, 8, 30, 4, 10, 2, 13, 20, 17, 5, 18,
                    ]),
                    maybe: new Set([]),
                    maybeGroups: new Map([]),
                },
            ],
            new Set([16, 1, 10, 2, 0, 30, 12, 34, 8, 13, 20, 17, 5, 18, 9]),
        ],
    ],
};
