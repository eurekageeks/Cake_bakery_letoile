/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFDF9",
          100: "#FAF6F0",
          200: "#F5ECE1",
          300: "#EADCC9",
          400: "#D7C1A7",
          500: "#BF9F80",
        },
        chocolate: {
          50: "#FBF7F5",
          100: "#F4EBE6",
          200: "#E6D3C7",
          300: "#CDAE9B",
          400: "#B0876E",
          500: "#795548",
          600: "#5D4037",
          700: "#3E2723",
          800: "#2C1810",
          900: "#1A0E08",
          950: "#0F0704",
        },
        blush: {
          50: "#FFF9F8",
          100: "#FDF2F0",
          200: "#FCE5E2",
          300: "#F7D6D0",
          400: "#EEAEA3",
          500: "#DF8173",
          600: "#C65C4D",
        },
        gold: {
          50: "#FDFCF7",
          100: "#FBF7EB",
          200: "#F5EBCB",
          300: "#ECDBA2",
          400: "#E1C56F",
          500: "#D4AF37",
          600: "#B89223",
          700: "#8C6A16",
        },
        sage: {
          50: "#F4F7F4",
          100: "#E5ECE5",
          200: "#CCD9CC",
          500: "#4E7356",
          600: "#3B5A42",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(44, 24, 16, 0.05)',
        'card': '0 10px 30px -4px rgba(44, 24, 16, 0.08)',
        'hover': '0 20px 35px -4px rgba(44, 24, 16, 0.12)',
        'gold': '0 8px 25px -3px rgba(212, 175, 55, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
