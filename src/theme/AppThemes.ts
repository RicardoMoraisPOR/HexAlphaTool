import { DefaultTheme } from 'styled-components';

export const baseTheme: DefaultTheme = {
  breakpoints: {
    min: {
      mobile: '@media only screen and (min-width: 600px)',
      tablet: '@media only screen and (min-width: 960px)',
      desktop: '@media only screen and (min-width: 1280px)',
    },
    max: {
      mobile: '@media only screen and (max-width: 600px)',
      tablet: '@media only screen and (max-width: 960px)',
      desktop: '@media only screen and (max-width: 1280px)',
    },
  },
  font: 'Inter, sans-serif',
  transitions: {
    fast: 300,
    normal: 800,
    slow: 1200,
  },
  palette: {
    accent: '#9ca3af',
    primary: '#d4d4d8', // zinc-400
    secondary: '#3f3f46', // zinc-800
    background: '#18181b', // zinc-900
    text: '#fafafa', // zinc-100
  },
};
