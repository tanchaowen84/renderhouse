import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
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
        background: '#0F1117', // Dark Slate Background (Global)
        foreground: '#F1F5F9', // Light Slate Text
        card: {
          DEFAULT: '#1E293B', // Slate-800 for cards
          foreground: '#F1F5F9',
        },
        popover: {
          DEFAULT: '#0F1117',
          foreground: '#F1F5F9',
        },
        primary: {
          DEFAULT: '#6366f1', // Indigo-500 (Less "Purple", more "Deep Blue/Indigo")
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#334155', // Slate-700
          foreground: '#F1F5F9',
        },
        muted: {
          DEFAULT: '#1e293b', // Slate-800
          foreground: '#94a3b8', // Slate-400
        },
        accent: {
          DEFAULT: '#1e293b',
          foreground: '#F1F5F9',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'rgba(255,255,255,0.1)', // Subtle white border for glass effect
        input: 'rgba(255,255,255,0.05)',
        ring: 'rgba(99,102,241,0.5)', // Indigo ring
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: '#0F1117',
          foreground: '#F1F5F9',
          primary: '#6366f1',
          'primary-foreground': '#ffffff',
          accent: '#1E293B',
          'accent-foreground': '#F1F5F9',
          border: 'rgba(255,255,255,0.1)',
          ring: '#6366f1',
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


