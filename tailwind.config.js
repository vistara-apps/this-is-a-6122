/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(0, 0%, 98%)',
        accent: 'hsl(220, 89%, 46%)',
        danger: 'hsl(0, 80%, 50%)',
        primary: 'hsl(220, 89%, 46%)',
        success: 'hsl(120, 80%, 40%)',
        surface: 'hsl(0, 0%, 100%)',
        warning: 'hsl(36, 80%, 40%)',
        'text-primary': 'hsl(220, 10%, 15%)',
        'text-secondary': 'hsl(220, 10%, 30%)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      spacing: {
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      boxShadow: {
        'card': '0 2px 6px hsla(220, 10%, 15%, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
        'slide-up': 'slideUp 400ms ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}