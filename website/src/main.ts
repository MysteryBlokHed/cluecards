import 'core-js/actual/iterator/every';
import 'core-js/actual/iterator/filter';
import 'core-js/actual/iterator/map';
import 'core-js/actual/iterator/some';
import 'core-js/actual/set/difference';
import 'core-js/actual/set/intersection';
import 'core-js/actual/set/is-disjoint-from';
import 'core-js/actual/set/symmetric-difference';
import 'core-js/actual/set/union';
import App from './App.svelte';
import { mount } from 'svelte';

const app = mount(App, {
    target: document.getElementById('app')!,
});

// Load service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .catch(err => console.error('Worker registration failed:', err));
}

export default app;
