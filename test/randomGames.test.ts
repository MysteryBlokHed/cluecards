import { describe, it } from 'vitest';

import { deepTest, TestData } from './utils.js';
import { randomGames } from './states/';

describe('random games', () => {
    it('0', () => deepTest(randomGames[0] as TestData));
});
