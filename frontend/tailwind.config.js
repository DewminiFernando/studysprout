/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── StudySprout design tokens (ss.*) ──
        ss: {
          // Surfaces / backgrounds (60%)
          bg:             '#F0EDE8',
          surface:        '#FFFFFF',
          'surface-green':'#EAF2EC',
          inner:          '#F7F5F1',

          // Sage green — primary brand (30%)
          green:          '#4A7558',
          'mid-green':    '#7A9E87',
          'light-green':  '#B8D4C0',
          'pale-green':   '#EAF2EC',
          sidebar:        '#4A7558',

          // Amber — accent / XP / CTA (10%)
          amber:          '#C8934A',
          'amber-light':  '#FFF3E0',
          'amber-border': '#F4A535',
          'amber-text':   '#7A4F00',

          // Semantic
          danger:         '#E24B4A',
          'danger-bg':    '#FCEBEB',
          'danger-text':  '#A32D2D',
          warning:        '#EF9F27',
          'warning-bg':   '#FFF8E1',
          'warning-text': '#5A3A00',
          success:        '#4A7558',
          'success-bg':   '#EAF2EC',
          'success-text': '#3B6D11',

          // Text
          text:           '#2C3A2E',
          muted:          '#6B7E6E',
          subtle:         '#9CA89D',

          // Borders
          border:         '#D6E4D8',
          'border-inner': '#EEF2EF',
        },

        // ── Legacy tokens — kept for backward compat in files not yet migrated ──
        sage: {
          DEFAULT: '#4A7558',
          light:   '#7A9E87',
          pale:    '#EAF2EC',
          dark:    '#3B5E48',
        },
        cream: {
          DEFAULT: '#F0EDE8',
          dark:    '#E5E1DB',
          darker:  '#D0CCC5',
        },
        amber: {
          DEFAULT: '#C8934A',
          light:   '#FFF3E0',
        },
        danger: {
          DEFAULT: '#E24B4A',
          light:   '#FCEBEB',
        },
        paper:        '#FFFFFF',
        moss:         '#3B6D11',
        'text-base':  '#2C3A2E',
        'text-muted': '#6B7E6E',
        'text-light': '#9CA89D',
      },

      fontFamily: {
        // Display / logo — Caveat
        display: ['Caveat', 'cursive'],
        caveat:  ['Caveat', 'cursive'],
        // Body — DM Sans
        body:    ['DM Sans', 'sans-serif'],
        sans:    ['DM Sans', 'sans-serif'],
        // Legacy mono kept for any remaining usages
        'dm-mono': ['DM Mono', 'monospace'],
      },

      borderRadius: {
        card:  '10px',
        pill:  '20px',
        btn:   '8px',
        tag:   '6px',
      },

      boxShadow: {
        focus: '0 0 0 2px #B8D4C0',
      },
    },
  },
  plugins: [],
}
