import type { ThemeMode } from '@/theme';
import { createContext } from 'react';

export interface ThemeModeValue {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
}

export const ThemeModeContext = createContext<ThemeModeValue | undefined>(undefined);
