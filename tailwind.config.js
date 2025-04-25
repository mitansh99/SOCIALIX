/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}", // This ensures Tailwind scans the right files
    ],
    theme: {
        extend: {
          colors: {
            primary: {
              DEFAULT: "#0a0147",    // base orange
              // light: "#ff944d",      // lighter shade
              // dark: "#cc5500"        // darker shade
            },
            // You can add secondary or neutral shades too
            secondary: "#F0F3F5",
            accent: "#fe696e"
          },
        },
      },
    plugins: [],
  };
  

