import { createAppTheme } from '@/theme';
import { ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useMemo } from 'react';
import { ThemeModeContext } from './ThemeModeContextBase';

export const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mode = 'dark';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode);
      document.body.setAttribute('data-theme', mode);
      
      const darkBg = 'radial-gradient(circle at 20% 12%, rgba(37,99,255,0.25) 0%, transparent 55%), radial-gradient(circle at 85% 70%, rgba(99,102,241,0.28) 0%, transparent 60%), linear-gradient(180deg,#0b1220,#0f172a)';
      document.documentElement.style.setProperty('--app-bg', darkBg);
      
      window.dispatchEvent(new CustomEvent('theme-mode-changed', { detail: { mode } }));
    }
  }, []);

  const theme = useMemo(() => createAppTheme(mode), []);
  const value = useMemo(() => ({ mode, toggle: () => {}, setMode: () => {} }), []);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
};