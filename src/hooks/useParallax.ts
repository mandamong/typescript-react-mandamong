import { usePerformance } from '@/contexts/PerformanceContext';
import { useUIEffects } from '@/contexts/UIEffectsContext';
import { useEffect } from 'react';
/** data-parallax="depth" 요소 translate/opacity 패럴랙스 */
export const useParallax = () => {
  const { parallax } = useUIEffects();
  const { perf } = usePerformance();
  useEffect(() => {
  if(!parallax || perf) return; 
    const els = Array.from(document.querySelectorAll('[data-parallax]')) as HTMLElement[];
    if (!els.length) return;
    const handle = () => {
      const h = window.innerHeight;
      els.forEach(el => {
        const rect = el.getBoundingClientRect();
        const midpoint = rect.top + rect.height/2 - h/2;
        const depthAttr = el.getAttribute('data-parallax');
        const depth = depthAttr && !isNaN(+depthAttr) ? +depthAttr : 30;
        const ratio = Math.min(1, Math.max(-1, midpoint / h));
        el.style.transform = `translate3d(0, ${ratio * depth}px, 0)`;
        el.style.opacity = String(1 - Math.abs(ratio) * 0.35);
      });
    };
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    window.addEventListener('resize', handle);
    return () => { window.removeEventListener('scroll', handle); window.removeEventListener('resize', handle); };
  }, [parallax, perf]);
};
export default useParallax;
