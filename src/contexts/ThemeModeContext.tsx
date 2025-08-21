import { createAppTheme, type ThemeMode } from '@/theme';
import { ThemeProvider } from '@mui/material/styles';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeModeContext } from './ThemeModeContextBase';

export const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('theme-mode') : null;
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme-mode', mode);
      document.documentElement.setAttribute('data-theme', mode);
    }
  }, [mode]);

  const setMode = useCallback((m: ThemeMode) => setModeState(m), []);
  const toggle = useCallback(() => setModeState((prev) => (prev === 'light' ? 'dark' : 'light')), []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);
  const value = useMemo(() => ({ mode, toggle, setMode }), [mode, toggle, setMode]);

  return (
  <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </ThemeModeContext.Provider>
  );
};
// useThemeMode 훅은 별도 파일로 분리 (useThemeMode.ts)
