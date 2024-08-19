import { FC, PropsWithChildren, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import Theme from './AppTheme.types';
import GlobalStyles from './GlobalStyles';
import { baseTheme } from './AppThemes';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

export const AppThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    const updateFavicon = () => {
      const isDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      const favicon = document.getElementById('favicon') as HTMLLinkElement;
      if (favicon) {
        favicon.href = isDarkMode ? '/logo-dark.svg' : '/logo-light.svg';
      }
    };

    updateFavicon();

    const darkModeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );
    darkModeMediaQuery.addEventListener('change', updateFavicon);

    // Cleanup listener on component unmount
    return () => {
      darkModeMediaQuery.removeEventListener('change', updateFavicon);
    };
  }, []);

  return (
    <ThemeProvider theme={baseTheme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
