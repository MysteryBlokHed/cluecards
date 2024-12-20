import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import wasm from 'vite-plugin-wasm';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte(), wasm()],
    build: {
        target: 'es2022',
        rollupOptions: {
            output: {
                assetFileNames(chunkInfo) {
                    // eslint-disable-next-line
                    // @ts-ignore
                    if (chunkInfo.originalFileName?.includes('images/'))
                        return chunkInfo.originalFileName;
                    return chunkInfo.name || '';
                },
            },
        },
    },
});
