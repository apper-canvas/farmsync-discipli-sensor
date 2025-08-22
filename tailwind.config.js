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
          50: '#f0f9e6',
          100: '#d9f0c2',
          200: '#bce59a',
          300: '#9dd970',
          400: '#82ce4d',
          500: '#2D5016',
          600: '#255014',
          700: '#1e4011',
          800: '#17300d',
          900: '#0f2009'
        },
        secondary: {
          50: '#f3f9eb',
          100: '#e3f2d1',
          200: '#c9e4a8',
          300: '#a8d574',
          400: '#7CB342',
          500: '#689f37',
          600: '#52802d',
          700: '#406625',
          800: '#35511f',
          900: '#2d431d'
        },
        accent: {
          50: '#fff3e0',
          100: '#ffe0b3',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#FF6F00',
          600: '#f57c00',
          700: '#e65100',
          800: '#d84315',
          900: '#bf360c'
        },
        success: '#43A047',
        warning: '#FFA726',
        error: '#E53935',
        info: '#1E88E5'
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}