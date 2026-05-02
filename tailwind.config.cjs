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
        },

        // Tema Cósmico — usado APENAS em /conexoes
        cosmic: {
          bg: '#0a0e1f',
          surface: '#121833',
          'surface-2': '#1a2042',
          border: 'rgba(255,255,255,0.08)',
          blue: '#3b82f6',
          'blue-light': '#60a5fa',
          gold: '#fbbf24',
          purple: '#a855f7',
          glow: 'rgba(96,165,250,0.4)',
        }
      },

      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'flow-line': {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        'pulse-scale': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
        'shake-soft': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },

      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'flow-line': 'flow-line 4s linear infinite',
        'pulse-scale': 'pulse-scale 2s ease-in-out infinite',
        'shake-soft': 'shake-soft 0.4s ease-in-out',
      },

      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'Times New Roman', 'serif'],
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
