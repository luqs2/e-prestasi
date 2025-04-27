module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        muted: 'var(--color-muted)',
        destructive: 'var(--color-destructive)',
      },
    },
  },
  plugins: [],
}