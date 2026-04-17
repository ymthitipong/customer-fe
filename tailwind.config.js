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
        },
        secondary: {
          DEFAULT: '#80B157',
        },
        brand: {
          text:       '#1A202C',
          bg:         '#F7FCF8',
          success:    '#38A169',
          warning:    '#D69E2E',
        },
      },
      fontFamily: {
        primary: ['Raleway', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
