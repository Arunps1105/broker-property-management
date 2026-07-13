export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Ink — the page & panel scale. Cooler and deeper than plain black/slate.
        ink: {
          950: '#0B0F17',
          900: '#141B29',
          800: '#1E2738',
          700: '#2A3548',
          600: '#3B475C',
          500: '#5A6780',
        },
        // Brass — primary accent. Ledger-gold, not amber/orange.
        brass: {
          50: '#FBF3E4',
          100: '#F5E4C1',
          200: '#EACB8B',
          300: '#DFB35E',
          400: '#D9A64C',
          500: '#C99038',
          600: '#AD7A2E',
          700: '#8C6224',
          800: '#6B4A1B',
          900: '#4A3212',
        },
        // Sage — secondary accent, used for "available"/success and as a cool counterweight to brass.
        sage: {
          50: '#EEF6F0',
          100: '#D7EBDC',
          200: '#B0D7BC',
          300: '#89C29C',
          400: '#68AE83',
          500: '#4F9A6C',
          600: '#3E7D57',
          700: '#316345',
          800: '#254A34',
          900: '#1A3325',
        },
        // Rose — danger / sold.
        rose: {
          50: '#FCEEF0',
          100: '#F8D3D9',
          200: '#F0A7B3',
          300: '#E87D91',
          400: '#E15A75',
          500: '#D33F5C',
          600: '#B12E48',
          700: '#8C2338',
          800: '#671929',
          900: '#42101A',
        },
        // Paper — warm off-white ink used for text on dark surfaces.
        paper: {
          DEFAULT: '#EDEAE1',
          dim: '#A9A493',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      backgroundImage: {
        'blueprint': `linear-gradient(rgba(217,166,76,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(217,166,76,0.06) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid-24': '24px 24px',
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(217,166,76,0.08) inset, 0 20px 40px -20px rgba(0,0,0,0.6)',
        'panel-lg': '0 1px 0 0 rgba(217,166,76,0.1) inset, 0 30px 60px -20px rgba(0,0,0,0.7)',
        brass: '0 8px 24px -8px rgba(217,166,76,0.45)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'stamp-in': 'stampIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        stampIn: {
          '0%': { transform: 'rotate(-6deg) scale(0.7)', opacity: '0' },
          '100%': { transform: 'rotate(-6deg) scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}