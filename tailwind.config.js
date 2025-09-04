/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./*.{tsx,ts}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#111827',
        surface: '#1F2937',
        primary: '#3B82F6',
        'primary-focus': '#2563EB',
        secondary: '#8B5CF6',
        accent: '#10B981',
        'text-primary': '#F9FAFB',
        'text-secondary': '#9CA3AF',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
