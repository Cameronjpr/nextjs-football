module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["ui-sans-serif", "system-ui"],
      serif: ["ui-serif", "Georgia"],
      mono: ["ui-monospace", "SFMono-Regular"],
      display: ["Oswald"],
      body: ['"Open Sans"'],
    },
    teams: {
      ars: {
        primaryColor: "#EF0107",
      },
    },
    extend: {
      fontFamily: {
        rubik: ["Rubik", "ui-serif", "ui-sans-serif"],
      },
    },
  },
  plugins: [],
};
