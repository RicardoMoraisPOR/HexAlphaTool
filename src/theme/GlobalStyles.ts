import { createGlobalStyle } from 'styled-components';
import { alphaHexConverter } from './AppThemeUtils';

const GlobalStyles = createGlobalStyle(({ theme }) => {
  return {
    '*, *::before, *::after': {
      transition: `background-color ${theme.transitions.fast}ms ease`,
      boxSizing: 'inherit',
    },

    '::-moz-selection': {
      color: theme.palette.secondary,
      background: theme.palette.primary,
    },

    '::selection': {
      color: theme.palette.secondary,
      background: theme.palette.primary,
    },

    html: {
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      boxSizing: 'border-box',
      WebkitTextSizeAdjust: '100%',
    },

    '&:focus-visible': {
      outline: `1px dashed ${alphaHexConverter(theme.palette.primary, 30)}`,
      outlineOffset: '2px',
    },

    h1: {
      fontSize: 'clamp(2.2rem, 5vw, 3rem)',
      textAlign: 'center',
    },

    h2: {
      textAlign: 'center',
    },

    span: {
      lineHeight: 1.6,
      letterSpacing: '0.5px',
    },

    a: {
      lineHeight: 1.6,
      letterSpacing: '0.5px',
      color: theme.palette.text,
      width: 'fit-content',
      position: 'relative',
      transition: `color ${theme.transitions.fast}ms linear`,
      textDecoration: 'none', // Remove the default underline
      '&:hover': {
        color: theme.palette.primary,
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: '-1.5px', // Adjust this value to move the underline lower
        height: '1px', // Adjust the thickness of the underline
        backgroundColor: 'currentColor', // Use the text color for the underline
      },
    },

    svg: {
      transition: `fill ${theme.transitions.fast}ms ease`,
    },

    body: {
      transition: `color ${theme.transitions.fast}ms linear, background-color ${theme.transitions.fast}ms ease, background ${theme.transitions.fast}ms ease`,
      margin: 0,
      color: theme.palette.text,
      backgroundColor: theme.palette.background,
      fontFamily: theme.font,
    },
  };
});

export default GlobalStyles;
