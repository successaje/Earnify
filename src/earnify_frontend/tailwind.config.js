/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
        'gradient-x-slow': 'gradient-x 15s ease infinite',
        'float': 'float 10s ease-in-out infinite alternate',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-position': '200% 0',
          },
          '50%': {
            'background-position': '0% 0',
          },
        },
        'float': {
          '0%': {
            transform: 'translateY(0) translateX(0)',
          },
          '50%': {
            transform: 'translateY(-20px) translateX(10px)',
          },
          '100%': {
            transform: 'translateY(0) translateX(0)',
          },
        },
      },
    },
  },
  plugins: [],
} 