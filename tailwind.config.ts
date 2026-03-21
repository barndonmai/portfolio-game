import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pub: {
          ink: '#1a120f',
          wall: '#2d1d19',
          floor: '#5d3a24',
          brass: '#b38a4c',
          ember: '#cf7a45',
          cream: '#f2e4c8',
        },
      },
      boxShadow: {
        panel: '0 20px 45px rgba(10, 7, 5, 0.45)',
      },
      fontFamily: {
        display: ['"Trebuchet MS"', 'sans-serif'],
        body: ['"Verdana"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
