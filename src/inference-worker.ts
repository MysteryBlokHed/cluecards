/// <reference lib="webworker" />
import { infer, probabilities } from '../inference/pkg/inference.js';

export interface InferenceWorkerApi {
    infer: typeof infer;
    probabilities: typeof probabilities;
}

import { expose } from 'comlink';
const api: InferenceWorkerApi = { infer, probabilities };
expose(api);
self.postMessage({ __ready: true }); // This causes an uncaught error in Comlink, but it doesn't actually matter
