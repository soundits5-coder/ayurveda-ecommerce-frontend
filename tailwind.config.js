/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ayurveda: {
          dark: '#132817',
          DEFAULT: '#1B3B22',
          medium: '#234C2C',
          light: '#2E633B',
          soft: '#EAF2EC'
        },
        cream: {
          50: '#FDFBF7',
          100: '#FAF6F0',
          200: '#F5EFEB',
          300: '#EFE7DF',
          DEFAULT: '#FAF6F0',
          card: '#F4EEE5',
          dark: '#E7DDD0'
        },
        earth: {
          heading: '#26211A',
          body: '#524B42',
          muted: '#857B70',
          border: '#E6DDD1',
          gold: '#B87834',
          bronze: '#9E6426'
        }
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(38, 33, 26, 0.06)',
        'card': '0 2px 10px rgba(38, 33, 26, 0.04)',
      }
    },
  },
  plugins: [],
}
