/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Cor legada (mantida para compatibilidade)
        parchment: '#f7f3ee',

        // Sistema de cores acessível (WCAG 2.1 AA/AAA)
        primary: {
          50: '#faf8f5',
          100: '#f7f3ee',  // parchment
          200: '#e8dfd2',
          300: '#d4c4ab',
        },

        // Accent - Call to Action (azul mariano)
        accent: {
          50: '#eff6ff',
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
        },

        // Secondary - Litúrgico (ouro/âmbar)
        secondary: {
          50: '#fef9e7',
          100: '#fdf2c9',
          200: '#fbe89f',
          300: '#f7dc6f',
          400: '#f4c542',
          500: '#eab308',
          600: '#ca8a04',
        },

        // Neutral - Texto e backgrounds (contraste otimizado)
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',  // WCAG AA ✅ (4.8:1 sobre parchment)
          700: '#404040',
          800: '#262626',  // Texto principal ✅ (8.1:1)
          900: '#171717',
        }
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },

      // Espaçamento adicional para breakpoints específicos
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
      },
    }
  },
  plugins: [],
}
