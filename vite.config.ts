import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte()],
    build: {
        rollupOptions: {
            output: {
                assetFileNames(chunkInfo) {
                    if (chunkInfo.originalFileName?.includes('images/'))
                        return chunkInfo.originalFileName;
                    return chunkInfo.name || '';
                },
            },
        },
    },
});
