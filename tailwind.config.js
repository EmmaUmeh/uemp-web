export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0f172a', 700: '#1e293b' },
        accent: { DEFAULT: '#0f766e', dark: '#115e59', light: '#ccfbf1' },
      },
    },
  },
  plugins: [],
};
