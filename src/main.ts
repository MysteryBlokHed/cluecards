import 'core-js/actual/set/difference';
import 'core-js/actual/set/intersection';
import 'core-js/actual/set/is-disjoint-from';
import 'core-js/actual/set/symmetric-difference';
import 'core-js/actual/set/union';
import './app.css';
import App from './App.svelte';

// Include icons in output
import '../images/icon-192.png';
import '../images/icon-512.png';

const app = new App({
    target: document.getElementById('app')!,
});

export default app;
