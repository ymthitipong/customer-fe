/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#024F42',
          50:  '#E6F5F2',
          100: '#C2E5DF',
          200: '#9AD5CA',
          300: '#6DC2B4',
          400: '#3DAE9D',
          500: '#024F42',
          600: '#024038',
          700: '#01302A',
          800: '#01201C',
          900: '#00100E',
        },
        secondary: {
          DEFAULT: '#80B157',
          50:  '#F2F7EB',
          100: '#DEECC8',
          200: '#C5DFA0',
          300: '#A8D074',
          400: '#80B157',
          500: '#6A9A43',
          600: '#527832',
          700: '#3C5824',
          800: '#263817',
          900: '#121C0A',
        },
        brand: {
          text:       '#1A202C',
          bg:         '#F7FCF8',
          success:    '#38A169',
          warning:    '#D69E2E',
        },
      },
      fontFamily: {
        sans: ['Raleway', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
