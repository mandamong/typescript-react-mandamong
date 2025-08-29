import { useEffect, useRef } from 'react';
interface PrefetchOnVisibleProps { importFunc: () => Promise<any>; }
/** viewport 진입 시 동적 import 미리 실행 */
export const PrefetchOnVisible: React.FC<PrefetchOnVisibleProps> = ({ importFunc }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if(!el || !('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting){ importFunc(); obs.disconnect(); } }); }, { rootMargin:'200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [importFunc]);
  return <div ref={ref} style={{ width:1, height:1, position:'absolute', top:0, left:0 }} aria-hidden />;
};
export default PrefetchOnVisible;
