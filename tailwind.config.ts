import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      // => @media (max-width: 1119px) { ... }
      md: { max: '1480px' }, // tablet

      // => @media (max-width: 743px) { ... }
      sm: { max: '768px' }, // mobile
    },
    extend: {
      colors: {
        gray: '#FCFCFC',
      },
    },
  },
  plugins: [],
};
export default config;
