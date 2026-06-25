/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand — sage palette
        // DEFAULT is now the rich dark sage (#4A7558) for buttons/icons.
        // light is the soft mid sage (#7A9E87) for borders/hover states.
        // pale is the faint sage tint (#EEF7F0) for backgrounds/chips.
        // dark is the deepest sage (#3B5E48) for hover on primary buttons.
        sage: {
          DEFAULT: '#4A7558',
          light:   '#7A9E87',
          pale:    '#EEF7F0',
          dark:    '#3B5E48',
        },
        cream: {
          DEFAULT: '#F5F2EB',
          dark:    '#EDE9DF',
          darker:  '#D8D3C5',
        },
        // Accent palette
        'accent-pink':     '#F4C0D1',
        'accent-lavender': '#C8B4E8',
        'accent-amber':    '#F5C28A',
        'accent-peach':    '#F5C4B3',
        // Text
        'text-base':  '#2C3A2E',
        'text-muted': '#7A9E87',
        'text-light': '#9AB09E',
        moss: '#5C7A4E',
        amber: {
          DEFAULT: '#C8934A',
          light:   '#F5E6D0',
        },
        danger: {
          DEFAULT: '#B05A5A',
          light:   '#F5E8E8',
        },
        paper: '#FFFEFB',
      },
      fontFamily: {
        // Nunito = primary body/UI font
        sans:     ['Nunito', 'sans-serif'],
        // Caveat = decorative titles only (logo, page titles, section heads, greeting)
        caveat:   ['Caveat', 'cursive'],
        // DM Mono = numbers only (XP, scores, percentages, counts)
        'dm-mono': ['DM Mono', 'monospace'],
      },
      borderColor: {
        card:    'rgba(74, 117, 88, 0.15)',
        DEFAULT: '#D8E8D8',
      },
      borderRadius: {
        card: '16px',
      },
    },
  },
  plugins: [],
}
