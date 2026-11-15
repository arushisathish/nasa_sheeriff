/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mars: {
          50: '#fdf3f0',
          100: '#fae3dc',
          200: '#f6cbbd',
          300: '#efa792',
          400: '#e57a5e',
          500: '#d95d39', // NASA Mars Rust accent
          600: '#c54425',
          700: '#a3331b',
          800: '#842c1b',
          900: '#6f281b',
          950: '#3c1109',
        },
        space: {
          950: '#06090e',
          900: '#0d1117', // Main background deep charcoal
          850: '#111620',
          800: '#161b22', // Card background / sub-panels
          750: '#1b222c',
          700: '#21262d', // Border color
          600: '#30363d', // Border light
          500: '#484f58',
          400: '#6e7681',
          300: '#8b949e',
          200: '#c9d1d9',
          100: '#f0f6fc',
        },
        terminal: {
          cyan: '#38bdf8',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          violet: '#a855f7',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Menlo', 'Consolas', 'Courier New', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
