import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0B1120',
          900: '#172554',
          800: '#1E3A8A',
          700: '#1D4ED8',
        },
        pantry: {
          bg: 'var(--pantry-bg)',
          surface: 'var(--pantry-surface)',
          border: 'var(--pantry-border)',
          subtle: 'var(--pantry-subtle)',
          text: 'var(--pantry-text)',
          muted: 'var(--pantry-muted)',
        },
        coral: {
          DEFAULT: '#F97366',
          hover: '#E85E50',
          soft: '#FDECE9',
        },
        amber: {
          DEFAULT: '#F5B942',
          soft: '#FEF3C7',
          dark: '#B45309',
        },
        stock: {
          green: '#16A34A',
          greenBg: '#DCFCE7',
          greenBorder: '#86EFAC',
          amber: '#D97706',
          amberBg: '#FEF3C7',
          amberBorder: '#FCD34D',
          red: '#DC2626',
          redBg: '#FEE2E2',
          redBorder: '#FCA5A5',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
