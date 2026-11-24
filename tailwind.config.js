/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs':  '375px',
      'sm':  '640px',
      'md':  '768px',
      'lg':  '1024px',
      'xl':  '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        /* Theme-aware colors — CSS variable RGB triplets + Tailwind <alpha-value>
           This lets bg-black/90, text-gray/65 etc. work while responding to theme. */
        black:        'rgb(var(--c-black) / <alpha-value>)',
        surface:      'rgb(var(--c-surface) / <alpha-value>)',
        ivory:        'rgb(var(--c-ivory) / <alpha-value>)',
        gray:         'rgb(var(--c-gray) / <alpha-value>)',
        'gray-dark':  'rgb(var(--c-gray-dark) / <alpha-value>)',
        'gray-mid':   'rgb(var(--c-gray-mid) / <alpha-value>)',

        /* Static brand colours (no theme change needed) */
        gold:         'rgb(var(--c-gold) / <alpha-value>)',
        'gold-soft':  'rgb(var(--c-gold-soft) / <alpha-value>)',
        'gold-dark':  'rgb(var(--c-gold-dark) / <alpha-value>)',
        'gold-muted': 'rgb(var(--c-gold-muted) / <alpha-value>)',
      },
      textColor: {
        /* gold TEXT is theme-aware (deeper antique gold on light backgrounds) */
        gold: 'rgb(var(--c-gold-text) / <alpha-value>)',
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'serif'],
        body:    ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'gold':      '0 0 20px rgb(var(--c-gold) / 0.4)',
        'gold-lg':   '0 0 40px rgb(var(--c-gold) / 0.3)',
        'gold-xl':   '0 0 60px rgb(var(--c-gold) / 0.25)',
        'gold-inner':'inset 0 0 20px rgb(var(--c-gold) / 0.1)',
      },
      backgroundImage: {
        'gold-gradient':  'linear-gradient(135deg, rgb(var(--c-gold)), rgb(var(--c-gold-soft)), rgb(var(--c-gold)))',
        'dark-gradient':  'linear-gradient(180deg, rgb(var(--c-black) / 0) 0%, rgb(var(--c-black) / 0.8) 50%, rgb(var(--c-black)) 100%)',
        'hero-gradient':  'linear-gradient(180deg, rgb(var(--c-black) / 0.3) 0%, rgb(var(--c-black) / 0.6) 50%, rgb(var(--c-black) / 0.95) 100%)',
        'card-gradient':  'linear-gradient(145deg, rgb(var(--c-gold) / 0.08) 0%, rgb(var(--c-black) / 0) 100%)',
      },
      keyframes: {
        float:       { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-18px)' } },
        glowPulse:   { '0%,100%': { boxShadow: '0 0 20px rgba(214,132,84,0.3)' }, '50%': { boxShadow: '0 0 50px rgba(214,132,84,0.65)' } },
        shimmer:     { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
        scrollDown:  { '0%': { opacity: 1, transform: 'translateY(0)' }, '100%': { opacity: 0, transform: 'translateY(18px)' } },
        borderGlow:  { '0%,100%': { borderColor: 'rgba(214,132,84,0.2)' }, '50%': { borderColor: 'rgba(214,132,84,0.7)' } },
        fadeUp:      { from: { opacity: 0, transform: 'translateY(40px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'glow-pulse':   'glowPulse 3s ease-in-out infinite',
        'shimmer':      'shimmer 2.5s linear infinite',
        'scroll-down':  'scrollDown 2s ease-in-out infinite',
        'border-glow':  'borderGlow 3s ease-in-out infinite',
        'fade-up':      'fadeUp 0.7s ease-out forwards',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
