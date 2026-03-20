/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest:  { DEFAULT: '#1a3328', mid: '#254d3c', light: '#2d6650' },
        sage:    { DEFAULT: '#4a8a72', light: '#7ab89f' },
        mint:    '#a8d5c2',
        cream:   '#f5f0e8',
        parchment: '#ede5d0',
        amber:   { DEFAULT: '#d4852a', light: '#e8a84e' },
        gold:    '#f0c060',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:  ['"Space Mono"', 'monospace'],
        hindi: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      animation: {
        'fade-up':   'fadeUp 0.5s ease forwards',
        'fade-in':   'fadeIn 0.4s ease forwards',
        'fill-bar':  'fillBar 1s ease forwards',
        'pop-in':    'popIn 0.4s ease forwards',
        'shimmer':   'shimmer 1.4s infinite',
        'blink':     'blink 1.4s infinite',
      },
      keyframes: {
        fadeUp:  { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        fillBar: { from: { width: 0 }, to: { width: 'var(--target-w)' } },
        popIn:   { '0%': { transform: 'scale(.85)', opacity: 0 }, '60%': { transform: 'scale(1.04)' }, '100%': { transform: 'scale(1)', opacity: 1 } },
        shimmer: { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
        blink:   { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.35 } },
      },
    },
  },
  plugins: [],
};
