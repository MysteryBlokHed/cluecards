import { describe, it } from 'vitest';

import { deepTest, TestData } from './utils';
import * as states from './states';

describe('game states that caused errors during development', () => {
    it('approximateMDS issues', () => deepTest(states.approximateMDSIssues as TestData));
});
