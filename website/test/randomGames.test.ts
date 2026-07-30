import { describe, it } from 'vitest';

import { deepTest, type TestData } from './utils.js';
import { randomGames } from './states/';

describe('random games', () => {
    randomGames.forEach((game, i) => {
        it(`${i}`, () => deepTest(game as TestData));
    });
});
