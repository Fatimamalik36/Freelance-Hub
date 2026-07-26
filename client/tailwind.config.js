/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        nude: "#E8C7B7",
        "nude-dark": "#D9AD97",
        beige: "#F5E6D3",
        cream: "#FFF8F0",
        mocha: "#8B5E3C",
        "mocha-dark": "#6E4A2F",
        ink: "#3D2B1F",
        glass: "rgba(255,255,255,0.75)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Playfair Display", "serif"],
        heading: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        "nude-gradient": "linear-gradient(135deg, #FFF8F0 0%, #F5E6D3 50%, #E8C7B7 100%)",
        "hero-gradient": "linear-gradient(120deg, #F5E6D3 0%, #E8C7B7 45%, #D9AD97 100%)",
        "mocha-gradient": "linear-gradient(135deg, #8B5E3C 0%, #6E4A2F 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(139, 94, 60, 0.15)",
        soft: "0 4px 24px rgba(61, 43, 31, 0.08)",
        "soft-lg": "0 12px 40px rgba(61, 43, 31, 0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -40px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        blob: "blob 10s infinite",
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [],
};
