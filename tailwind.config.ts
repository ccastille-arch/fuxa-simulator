import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "fuxa-bg": "#2b2b2b",
        "fuxa-panel": "#4D4D4D",
        "fuxa-green": "#00b050",
        "fuxa-red": "#c00000",
        "fuxa-blue": "#5A9CFE",
        "fuxa-gray": "#595959",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        "roboto-bold": ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
