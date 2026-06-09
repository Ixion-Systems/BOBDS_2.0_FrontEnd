import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-container-low": "#1b1c1c",
        "secondary": "#c4c4e1",
        "inverse-surface": "#e4e2e1",
        "inverse-primary": "#5f5e5e",
        "inverse-on-surface": "#303030",
        "on-tertiary-fixed-variant": "#484645",
        "tertiary-fixed-dim": "#cac6c3",
        "on-background": "#e4e2e1",
        "surface": "#131313",
        "surface-container-lowest": "#0e0e0e",
        "secondary-container": "#43455d",
        "outline": "#8e9192",
        "secondary-fixed-dim": "#c4c4e1",
        "on-tertiary-container": "#7d7a78",
        "surface-variant": "#353535",
        "tertiary-fixed": "#e6e1df",
        "on-primary-fixed-variant": "#474646",
        "primary": "#c9c6c5",
        "outline-variant": "#444748",
        "surface-tint": "#c9c6c5",
        "primary-fixed-dim": "#c9c6c5",
        "on-primary-fixed": "#1c1b1b",
        "primary-container": "#0c0c0c",
        "background": "#0c0c0c",
        "surface-bright": "#393939",
        "on-tertiary-fixed": "#1d1b1a",
        "secondary-fixed": "#e0e0fe",
        "tertiary-container": "#0d0c0b",
        "on-secondary-fixed-variant": "#43455d",
        "primary-fixed": "#e5e2e1",
        "tertiary": "#cac6c3",
        "on-secondary-container": "#b2b3cf",
        "on-secondary": "#2d2f45",
        "on-error-container": "#ffdad6",
        "on-surface": "#e4e2e1",
        "error-container": "#93000a",
        "on-secondary-fixed": "#181a2f",
        "on-primary": "#313030",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353535",
        "on-tertiary": "#32302f",
        "on-error": "#690005",
        "surface-dim": "#131313",
        "on-primary-container": "#7b7a79",
        "error": "#ffb4ab",
        "surface-container": "#1f2020",
        "on-surface-variant": "#c4c7c7",
        "pop-yellow": "#FFE100"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "gutter": "24px",
        "margin-desktop": "48px",
        "container-max": "1440px",
        "unit": "4px",
        "margin-mobile": "16px"
      },
      fontFamily: {
        "headline-lg-mobile": ["Stack Sans Notch", "sans-serif"],
        "headline-lg": ["Stack Sans Notch", "sans-serif"],
        "display": ["Stack Sans Notch", "sans-serif"],
        "body-md": ["Raleway", "sans-serif"],
        "body-lg": ["Raleway", "sans-serif"],
        "label-sm": ["Raleway", "sans-serif"],
        "headline-md": ["Stack Sans Notch", "sans-serif"],
        "cta": ["Raleway", "sans-serif"]
      },
      fontSize: {
        "headline-lg-mobile": ["24px", { "lineHeight": "1.2", "fontWeight": "600" }],
        "headline-lg": ["32px", { "lineHeight": "1.2", "fontWeight": "600" }],
        "display": ["48px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "body-md": ["16px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "label-sm": ["12px", { "lineHeight": "1", "letterSpacing": "0.02em", "fontWeight": "500" }],
        "headline-md": ["24px", { "lineHeight": "1.3", "fontWeight": "600" }],
        "cta": ["14px", { "lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "700" }]
      }
    },
  },
  plugins: [
    forms,
    containerQueries
  ],
}

