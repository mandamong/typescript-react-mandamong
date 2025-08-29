import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
export type Accent = 'blue' | 'violet' | 'teal' | 'pink' | 'amber';
interface AccentContextValue { accent: Accent; setAccent: (a: Accent) => void; gradient: string; }
const AccentThemeContext = createContext<AccentContextValue | undefined>(undefined);
const accentGradients: Record<Accent, string> = {
  blue: 'linear-gradient(135deg,#2563ff,#4f46e5 55%,#6366f1)',
  violet: 'linear-gradient(135deg,#7c3aed,#9333ea 50%,#a855f7)',
  teal: 'linear-gradient(135deg,#0d9488,#14b8a6 55%,#06b6d4)',
  pink: 'linear-gradient(135deg,#ec4899,#d946ef 50%,#f472b6)',
  amber: 'linear-gradient(135deg,#f59e0b,#f97316 55%,#fbbf24)'
};
export const AccentThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accent, setAccent] = useState<Accent>('blue');
  const gradient = accentGradients[accent];
  useEffect(()=>{ document.documentElement.style.setProperty('--gradient-primary', gradient); }, [gradient]);
  const value = useMemo(()=>({ accent, setAccent, gradient }), [accent, gradient]);
  return <AccentThemeContext.Provider value={value}>{children}</AccentThemeContext.Provider>;
};
export const useAccent = () => { const ctx = useContext(AccentThemeContext); if(!ctx) throw new Error('useAccent must be used within AccentThemeProvider'); return ctx; };
export default AccentThemeContext;
