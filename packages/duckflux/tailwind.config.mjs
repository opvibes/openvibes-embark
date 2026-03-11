/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        duck: {
          50:  '#FFFDE7',
          100: '#FFF9C4',
          200: '#FFF176',
          300: '#FFEE58',
          400: '#FFCA28',
          500: '#FFD700',
          600: '#F5C518',
          700: '#DAA520',
          800: '#B8860B',
          900: '#8B6914',
        },
        surface: {
          DEFAULT: '#12122a',
          hover:   '#1a1a38',
          border:  '#2a2a4a',
          muted:   '#1e1e3a',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
        sans: ['Outfit', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'duck-gradient': 'linear-gradient(160deg, #0a0a1a 0%, #0d1b2a 60%, #0a0f1e 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(26,26,58,0.8) 0%, rgba(18,18,42,0.9) 100%)',
        'glow-yellow':   'radial-gradient(ellipse at center, rgba(255,215,0,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'duck':      '0 0 20px rgba(255,215,0,0.25), 0 0 60px rgba(255,215,0,0.1)',
        'duck-sm':   '0 0 10px rgba(255,215,0,0.2)',
        'duck-lg':   '0 0 40px rgba(255,215,0,0.3), 0 0 80px rgba(255,215,0,0.1)',
        'card':      '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card-hover':'0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'float-slow':  'float 9s ease-in-out infinite',
        'pulse-glow':  'pulse-glow 3s ease-in-out infinite',
        'fade-up':     'fade-up 0.6s ease-out forwards',
        'slide-right': 'slide-right 0.7s ease-out forwards',
        'blink':       'blink 1.2s step-end infinite',
        'spin-slow':   'spin 8s linear infinite',
        'scan':        'scan 2.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':       { transform: 'translateY(-12px) rotate(-3deg)' },
          '66%':       { transform: 'translateY(-6px) rotate(3deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%':       { opacity: '0.8' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-right': {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0' },
        },
        scan: {
          from: { clipPath: 'inset(0 0 100% 0)' },
          to:   { clipPath: 'inset(0 0 0% 0)' },
        },
      },
    },
  },
  plugins: [],
};
