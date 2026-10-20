/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    '../tan-sanh-ngu-landing/src/**/*.{js,jsx,ts,tsx}',
    '../mockup/**/*.{html,js}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary-rgb, 0 58 112) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark-rgb, 0 38 74) / <alpha-value>)',
          light: 'rgb(var(--color-primary-light-rgb, 27 82 138) / <alpha-value>)',
          50: 'var(--color-primary-50, rgb(0 58 112 / 0.05))',
          100: 'var(--color-primary-100, rgb(0 58 112 / 0.1))',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary-rgb, 255 200 77) / <alpha-value>)',
          hover: 'rgb(var(--color-secondary-hover-rgb, 242 185 56) / <alpha-value>)',
          dark: 'rgb(var(--color-secondary-dark-rgb, 212 155 30) / <alpha-value>)',
          50: 'var(--color-secondary-50, rgb(255 200 77 / 0.08))',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent-rgb, 255 200 77) / <alpha-value>)',
          hover: 'rgb(var(--color-secondary-hover-rgb, 242 185 56) / <alpha-value>)',
          dark: 'rgb(var(--color-accent-dark-rgb, 212 155 30) / <alpha-value>)',
        },
        brand: {
          navy: '#003A70',
          blue: '#1E40AF',
          emerald: '#059669',
          amber: '#D97706',
          rose: '#E11D48',
          indigo: '#4F46E5',
          violet: '#7C3AED',
        },
        surface: 'var(--color-surface, #FFFFFF)',
        'surface-muted': 'var(--color-surface-muted, #F4F7FC)',
        'text-muted': 'var(--color-text-muted, #5D7186)',
        highlight: 'rgb(var(--color-secondary-rgb, 255 200 77) / <alpha-value>)',
        navy: 'rgb(var(--color-primary-rgb, 0 58 112) / <alpha-value>)',
        gold: 'rgb(var(--color-secondary-rgb, 255 200 77) / <alpha-value>)',
      },
      fontFamily: {
        heading: ['var(--font-heading, "Be Vietnam Pro")', 'sans-serif'],
        body: ['var(--font-body, "Be Vietnam Pro")', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(0, 0, 0, 0.06)',
        'card': '0 4px 25px 0 rgba(0,0,0,0.07)',
        'hover': '0 20px 35px -5px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        'none': '0px',
        'sm': 'var(--radius-sm, 4px)',
        'DEFAULT': 'var(--radius-md, 8px)',
        'md': 'var(--radius-md, 8px)',
        'lg': 'var(--radius-lg, 12px)',
        'xl': 'var(--radius-xl, 16px)',
        '2xl': 'var(--radius-2xl, 24px)',
        '3xl': 'var(--radius-3xl, 32px)',
        'full': '9999px',
      },
    },
  },
  plugins: [],
};
