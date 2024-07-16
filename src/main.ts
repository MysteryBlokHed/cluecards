import 'core-js/actual/set/intersection';
import 'core-js/actual/set/symmetric-difference';
import 'core-js/actual/set/union';
import './app.css';
import App from './App.svelte';

const app = new App({
    target: document.getElementById('app')!,
});

export default app;
