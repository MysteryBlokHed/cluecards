/// <reference lib="webworker" />
self.onmessage = async event => {
    self.postMessage('got it');
    console.log(event);
};
