/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
       colors: {
        blue1: '#f5fcff',
        blue2: '#dbf3fa',
        blue3: '#50b8e7',
        gres:'#0f8a3c',
        slateBlue: '#4C6E91',
      },
    },
  },
  plugins: [],
}