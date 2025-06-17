import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import wasm from 'vite-plugin-wasm';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte(), wasm()],
    worker: { plugins: () => [wasm()], format: 'es' },
    build: { target: 'es2022' },
});
