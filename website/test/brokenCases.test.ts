import { describe, it } from 'vitest';

import { deepTest, TestData } from './utils';
import * as states from './states';

describe('game states that caused errors during development', () => {
    it('MHS issues', () => deepTest(states.mhsIssues as TestData));
});
