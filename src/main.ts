import 'core-js/actual/iterator/every';
import 'core-js/actual/set/difference';
import 'core-js/actual/set/intersection';
import 'core-js/actual/set/is-disjoint-from';
import 'core-js/actual/set/symmetric-difference';
import 'core-js/actual/set/union';
import './app.css';
import App from './App.svelte';

const app = new App({
    target: document.getElementById('app')!,
});

// Load service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('Worker registered'))
        .catch(err => console.error('Worker registration failed:', err));
}

export default app;
