/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          300: '#7EE7C8',
          400: '#3ED6A0',
          500: '#1F8A8A',
          600: '#082F3A',
          700: '#062030',
          800: '#041520',
          900: '#030A0E',
        },
        aqua: '#3ED6A0',
        chrome: '#C0C0C0',
        gold: '#D4AF37',
        'gold-soft': '#F5E6A3',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(62, 214, 160, 0.3)',
        'glow-lg': '0 0 40px rgba(62, 214, 160, 0.4)',
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.3)',
      },
      animation: {
        'letter-reveal': 'letterReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-up': 'fadeSlideUp 1s cubic-bezier(0.16, 1, 0.3, 1) both',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'shimmer': 'shimmer 2s linear infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        letterReveal: {
          from: {
            opacity: '0',
            transform: 'translateY(80px) rotateX(-40deg) scale(0.9)',
            filter: 'blur(4px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0) rotateX(0deg) scale(1)',
            filter: 'blur(0)',
          },
        },
        fadeSlideUp: {
          from: { opacity: '0', transform: 'translateY(50px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { filter: 'brightness(1) drop-shadow(0 0 0 transparent)' },
          '50%': { filter: 'brightness(1.2) drop-shadow(0 0 20px rgba(62, 214, 160, 0.4))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-8px) rotate(1deg)' },
          '50%': { transform: 'translateY(-12px) rotate(0deg)' },
          '75%': { transform: 'translateY(-8px) rotate(-1deg)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.8)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
    },
  },
  plugins: [],
};
