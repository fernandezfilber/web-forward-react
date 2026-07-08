/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta blanco y negro
        primary: {
          50:  '#f9f9f9',
          100: '#f0f0f0',
          200: '#d9d9d9',
          300: '#bfbfbf',
          400: '#8c8c8c',
          500: '#595959',
          600: '#404040',
          700: '#262626',
          800: '#141414',
          900: '#0a0a0a',
          950: '#050505',
        },
        secondary: {
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#ebebeb',
          300: '#d6d6d6',
          400: '#adadad',
          500: '#858585',
          600: '#666666',
          700: '#525252',
          800: '#3d3d3d',
          900: '#292929',
        },
        // Mantener cyan/magenta como alias a negro para no romper clases existentes
        cyan: {
          400: '#111111',
          500: '#000000',
        },
        magenta: {
          500: '#333333',
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.8s ease-out',
        slideInLeft: 'slideInLeft 0.6s ease-out',
        slideInRight: 'slideInRight 0.6s ease-out',
        scaleIn: 'scaleIn 0.5s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translate3d(0, 40px, 0)',
          },
          '100%': {
            opacity: '1',
            transform: 'translate3d(0, 0, 0)',
          },
        },
        slideInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translate3d(-40px, 0, 0)',
          },
          '100%': {
            opacity: '1',
            transform: 'translate3d(0, 0, 0)',
          },
        },
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translate3d(40px, 0, 0)',
          },
          '100%': {
            opacity: '1',
            transform: 'translate3d(0, 0, 0)',
          },
        },
        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
}
