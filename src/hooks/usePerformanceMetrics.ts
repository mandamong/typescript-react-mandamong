import { useEffect } from 'react';
/** 간단 Web Vitals 비슷한 FCP/LCP 로그 훅 */
export const usePerformanceMetrics = () => {
  useEffect(() => {
    if (!('PerformanceObserver' in window)) return;
    try {
      const log = (name: string, value: number) => { console.log('[perf]', name, value.toFixed(1)+'ms'); };
      const po = new PerformanceObserver((list) => {
        list.getEntries().forEach((e: any) => {
          if (e.entryType === 'paint') log(e.name, e.startTime);
          if (e.entryType === 'largest-contentful-paint') log('LCP', e.startTime);
        });
      });
      po.observe({ type: 'paint', buffered: true } as any);
      po.observe({ type: 'largest-contentful-paint', buffered: true } as any);
      return () => po.disconnect();
    } catch {}
  }, []);
};
export default usePerformanceMetrics;
