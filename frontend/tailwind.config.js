/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#7A9E87',
          light: '#B8D4C0',
          pale: '#E8F2EB',
          dark: '#4A7558',
        },
        cream: {
          DEFAULT: '#F5F2EB',
          dark: '#EDE9DF',
          darker: '#D8D3C5',
        },
        'text-base': '#2C3A2E',
        'text-muted': '#6B7E6E',
        'text-light': '#9AB09E',
        moss: '#5C7A4E',
        amber: {
          DEFAULT: '#C8934A',
          light: '#F5E6D0',
        },
        danger: {
          DEFAULT: '#B05A5A',
          light: '#F5E8E8',
        },
        paper: '#FFFEFB',
      },
      fontFamily: {
        caveat: ['Caveat', 'cursive'],
        sans: ['DM Sans', 'sans-serif'],
      },
      borderColor: {
        card: 'rgba(122, 158, 135, 0.2)',
      },
    },
  },
  plugins: [],
}
