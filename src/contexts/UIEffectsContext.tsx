import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
interface UIEffectsState { particles: boolean; parallax: boolean; tilt: boolean; toggle: (k: keyof Omit<UIEffectsState,'toggle'|'setAll'>) => void; setAll: (s: Partial<Omit<UIEffectsState,'toggle'|'setAll'>>) => void; }
const UIEffectsContext = createContext<UIEffectsState | undefined>(undefined);
const LS_KEY = 'ui-effects';
export const UIEffectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState({ particles: true, parallax: true, tilt: true });
  useEffect(()=>{ try { const raw = localStorage.getItem(LS_KEY); if(raw) setState(s => ({ ...s, ...JSON.parse(raw) })); } catch {} },[]);
  const persist = (next: typeof state) => { setState(next); try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {} };
  const toggle = useCallback((key: keyof Omit<UIEffectsState,'toggle'|'setAll'>) => { persist({ ...state, [key]: !state[key] }); }, [state]);
  const setAll = (s: Partial<Omit<UIEffectsState,'toggle'|'setAll'>>) => persist({ ...state, ...s });
  return <UIEffectsContext.Provider value={{ ...state, toggle, setAll }}>{children}</UIEffectsContext.Provider>; };
export const useUIEffects = () => { const ctx = useContext(UIEffectsContext); if(!ctx) throw new Error('useUIEffects must be used within UIEffectsProvider'); return ctx; };
export default UIEffectsContext;
