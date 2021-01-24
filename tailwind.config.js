module.exports = {
  purge: ["./pages/**/*.jsx", "./components/**/*.jsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "slack-base": "#4a154b",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
