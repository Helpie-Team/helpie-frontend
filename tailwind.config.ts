import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    screens: {
      // => @media (max-width: 1119px) { ... }
      md: { max: '1480px' }, // tablet

      // => @media (max-width: 743px) { ... }
      sm: { max: '768px' }, // mobile
    },

    extend: {
      fontFamily: {
        pretendard: ["var(--font-pretendard)"],
      },
      fontSize: {
        'h1-sb': ['24px', { lineHeight: '1.4', fontWeight: '700' }],
        'h2-sb': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'h2': ['20px', { lineHeight: '1.4', fontWeight: '500' }],
        'h2-regular': ['20px', { lineHeight: '1.4', fontWeight: '400' }],
        'h3-sb': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'h3': ['18px', { lineHeight: '1.4', fontWeight: '500' }],
        'h3-regular': ['18px', { lineHeight: '1.4', fontWeight: '400' }],
        'body1-sb': ['16px', { lineHeight: '1.5', fontWeight: '600' }],
        'body1': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
        'body1-regular': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body2-sb': ['15px', { lineHeight: '1.5', fontWeight: '600' }],
        'body2': ['15px', { lineHeight: '1.5', fontWeight: '500' }],
        'body2-regular': ['15px', { lineHeight: '1.5', fontWeight: '400' }],
        'body3-sb': ['14px', { lineHeight: '1.5', fontWeight: '600' }],
        'body3': ['14px', { lineHeight: '1.5', fontWeight: '500' }],
        'body3-regular': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption1-sb': ['12px', { lineHeight: '1.5', fontWeight: '600' }],
        'caption1-b': ['12px', { lineHeight: '1.5', fontWeight: '500' }],
        'caption1-regular': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      boxShadow: {
        'shadow-1': '0 2px 10px -1px rgba(0, 0, 0, 0.4)',
        'icon': '0 0 2px 1px rgba(0, 0, 0, 0.4)',
      },
      colors: {
        gray: '#FCFCFC',
        key: {
          100: '#FF4D00',
          200: '#FCA27C',
          300: '#F7EDE9'
        },
        state: {
          error: '#FF2222',
          success: '#5CBE39',
        },
        grayScale: {
          white: '#FFFFFF',
          bg: 'E6E6E6',
          100: '#F0F0F0',
          200: '#E6E6E6',
          300: '#CCCBCB',
          400: '#B3B2B1',
          500: '#8C8B8B',
          600: '#666463',
          700: '#262525',
          black: '#000000',
        },
      },

    },
  },
  plugins: [],
};
export default config;
