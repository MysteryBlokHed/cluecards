import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import daisyui from 'daisyui';
import { light, dark } from 'daisyui/src/theming/themes.js';

export default {
    darkMode: 'media',

    content: ['./src/**/*.{html,js,svelte,ts}'],

    theme: {
        extend: {
            colors: {
                primary: '#ed1c24',
                secondary: '#676778',
            },
            fontFamily: {
                sans: ['InterVariable', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    daisyui: {
        logs: false,
        themes: [
            {
                light: {
                    ...light,
                    primary: '#ed1c24',
                    secondary: '#676778',
                },
            },
            {
                dark: {
                    ...dark,
                    primary: '#ed1c24',
                    secondary: '#676778',
                },
            },
        ],
    },

    plugins: [daisyui],
} satisfies Config;
