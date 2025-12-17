import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        background: '#f5f6f7',
        foreground: '#1f242c',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1f242c',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#1f242c',
        },
        primary: {
          DEFAULT: '#1f4b3e', // bamboo green
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#e6e8ec',
          foreground: '#1f242c',
        },
        muted: {
          DEFAULT: '#f0f2f5',
          foreground: '#6a707a',
        },
        accent: {
          DEFAULT: '#f0f2f5',
          foreground: '#1f242c',
        },
        destructive: {
          DEFAULT: '#ff7a7a',
          foreground: '#ffffff',
        },
        border: '#e3e6ea',
        input: '#e3e6ea',
        ring: '#1f4b3e',
        chart: {
          '1': '#1f4b3e',
          '2': '#4b82f3',
          '3': '#6bb4a0',
          '4': '#f1c86a',
          '5': '#d67b6d',
        },
        sidebar: {
          DEFAULT: '#f5f6f7',
          foreground: '#1f242c',
          primary: '#1f4b3e',
          'primary-foreground': '#ffffff',
          accent: '#f0f2f5',
          'accent-foreground': '#1f242c',
          border: '#e3e6ea',
          ring: '#1f4b3e',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #1e293b 0deg, #0f1117 180deg, #1e293b 360deg)',
      },
    },
  },
  plugins: [animate],
};
export default config;
