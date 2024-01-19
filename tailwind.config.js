/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,css}'],
    theme: {
        extend: {
            colors: {
                three_blue: '#4DD0E1',
                three_hotpink: '#f42aad',
                three_black: '#292929',
                three_purple: '#7c4de1',
                three_darkpurple: '#673ab7',
            },
            backgroundImage: {
                'dot-pattern':
                    'radial-gradient(#ffffff 1px, transparent 0),radial-gradient(#ffffff 1px, transparent 0)',
            },
            backgroundSize: {
                '16/16': '4rem 4rem',
            },
            backgroundPosition: {
                'rotate-45': '0 10px, 32px 42px',
            },
            boxShadow: {},
        },
    },
    plugins: [],
};
