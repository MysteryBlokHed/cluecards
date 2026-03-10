import { defineConfig, searchForWorkspaceRoot } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
    plugins: [sveltekit(), wasm()],
    worker: { plugins: () => [wasm()], format: 'es' },
    server: { fs: { allow: [searchForWorkspaceRoot(process.cwd()), '../inference'] } },
});
