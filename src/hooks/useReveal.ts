import { useEffect, useRef } from 'react';

export const useReveal = (options?: IntersectionObserverInit) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const mutationRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const config: IntersectionObserverInit = {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12,
      ...(options || {})
    };

    const ensureObserver = () => {
      if (observerRef.current) return;
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('reveal-in');
            observerRef.current?.unobserve(e.target);
          }
        });
      }, config);
    };

    const scan = () => {
      ensureObserver();
      const obs = observerRef.current!;
      const nodes = Array.from(document.querySelectorAll('[data-reveal]')) as HTMLElement[];
      for (const el of nodes) {
        if (el.classList.contains('reveal-in')) continue; 
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * 0.88 && rect.bottom > window.innerHeight * 0.12; 
        if (inView) {
          el.classList.add('reveal-in');
        } else {
          obs.observe(el);
        }
      }
    };

    
    scan();

    
    mutationRef.current = new MutationObserver((records) => {
      let needsScan = false;
      for (const r of records) {
        if (r.type === 'childList' && (r.addedNodes?.length || 0) > 0) {
          needsScan = true; break;
        }
      }
      if (needsScan) {
        
        queueMicrotask(scan);
      }
    });
    mutationRef.current.observe(document.body, { childList: true, subtree: true });

    
    const onThemeChange = () => scan();
    window.addEventListener('theme-mode-changed', onThemeChange);

    
    window.addEventListener('resize', scan);

    return () => {
      observerRef.current?.disconnect();
      mutationRef.current?.disconnect();
      window.removeEventListener('theme-mode-changed', onThemeChange);
      window.removeEventListener('resize', scan);
    };
  }, [options]);
};

export default useReveal;
