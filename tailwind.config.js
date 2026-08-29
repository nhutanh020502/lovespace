/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        love: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        warm: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
        },
        blush: {
          50: '#fff8f8',
          100: '#ffefef',
          200: '#fed7d7',
          300: '#feb2b2',
          400: '#fc8181',
          500: '#f56565',
        },
        aurora: {
          peach: '#ffd1b3',
          rose: '#ff9ebb',
          violet: '#d8b4fe',
          amber: '#fef08a',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Quicksand', 'Nunito', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(244, 63, 94, 0.12)',
        'glass-card': '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
        'glow': '0 0 25px rgba(244, 63, 94, 0.4)',
        'glow-lg': '0 0 35px rgba(244, 63, 94, 0.55)',
        'glow-violet': '0 0 25px rgba(168, 85, 247, 0.4)',
        'glow-amber': '0 0 25px rgba(251, 191, 36, 0.4)',
        'luxury': '0 20px 50px -12px rgba(244, 63, 94, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.8)',
      },
      animation: {
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
