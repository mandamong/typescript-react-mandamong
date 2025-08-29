import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface PerformanceState {
  perf: boolean;          
  ultra: boolean;         
  reason: string[];       
  setForced?: (v: boolean | null) => void; 
  forced: boolean | null; 
}

const PerformanceContext = createContext<PerformanceState | undefined>(undefined);

const detect = (): { perf: boolean; ultra: boolean; reason: string[] } => {
  const reason: string[] = [];
  let perf = false; let ultra = false;
  try {
    const dm = (navigator as any).deviceMemory as number | undefined;
    if (dm && dm <= 4) { perf = true; reason.push('deviceMemory<=4'); }
    const cores = (navigator as any).hardwareConcurrency as number | undefined;
    if (cores && cores <= 4) { perf = true; reason.push('lowCores'); }
    if (window.innerWidth < 820) { perf = true; reason.push('narrowViewport'); }
    if (window.innerWidth < 600) { ultra = true; reason.push('veryNarrow'); }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { perf = true; ultra = true; reason.push('reducedMotion'); }
  } catch {}
  if (ultra) perf = true;
  return { perf, ultra, reason };
};

export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [forced, setForced] = useState<boolean | null>(null);
  const [auto, setAuto] = useState(()=>detect());
  useEffect(() => {
    const handle = () => setAuto(detect());
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
  
  useEffect(()=>{
    if (typeof document === 'undefined') return;
    const cls = 'perf-mode';
    if(valueRef.current?.perf) document.documentElement.classList.add(cls); else document.documentElement.classList.remove(cls);
  });
  const valueRef = React.useRef<PerformanceState | null>(null);

  const value = useMemo<PerformanceState>(() => {
    const perf = forced !== null ? forced : auto.perf;
    const ultra = forced !== null ? forced && auto.ultra : auto.ultra;
  const v = { perf, ultra, reason: auto.reason, setForced, forced };
  valueRef.current = v;
  return v;
  }, [forced, auto]);

  return <PerformanceContext.Provider value={value}>{children}</PerformanceContext.Provider>;
};

export const usePerformance = () => {
  const ctx = useContext(PerformanceContext);
  if (!ctx) throw new Error('usePerformance must be used within PerformanceProvider');
  return ctx;
};
