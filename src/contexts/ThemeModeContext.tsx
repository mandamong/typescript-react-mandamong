import { createAppTheme, type ThemeMode } from '@/theme';
import { ThemeProvider } from '@mui/material/styles';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface ThemeModeValue {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
}

const Ctx = createContext<ThemeModeValue | undefined>(undefined);

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
    <Ctx.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Ctx.Provider>
  );
};

export const useThemeMode = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
};
