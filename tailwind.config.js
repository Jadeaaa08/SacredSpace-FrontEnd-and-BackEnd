import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#121212',
        accent: '#A3B18A',
        text: '#F2E9E4',
        surface: 'rgba(255,255,255,0.05)',
        surfaceStrong: 'rgba(255,255,255,0.12)',
        border: 'rgba(255,255,255,0.10)',
      },
      boxShadow: {
        glow: '0 40px 120px rgba(0, 0, 0, 0.18)',
      },
      backdropBlur: {
        xl: '40px',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
