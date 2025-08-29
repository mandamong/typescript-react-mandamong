import React, { useRef } from 'react';
interface TiltProps extends React.HTMLAttributes<HTMLDivElement> { max?: number; scale?: number; glare?: boolean; }
const Tilt: React.FC<TiltProps> = ({ children, max = 10, scale = 1.02, glare = false, style, ...rest }) => {
  const ref = useRef<HTMLDivElement>(null);
  const handle = (e: React.MouseEvent) => {
    const el = ref.current; if(!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width; 
    const y = (e.clientY - r.top) / r.height;
    const rx = (y - 0.5) * max * -1;
    const ry = (x - 0.5) * max;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
    if (glare) {
      const g = el.querySelector<HTMLElement>('.tilt-glare');
      if (g) {
        const angle = Math.atan2(y - 0.5, x - 0.5) * 180 / Math.PI + 180;
        g.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,0.55), transparent 60%)`;
        g.style.opacity = '0.35';
      }
    }
  };
  const reset = () => {
    const el = ref.current; if(!el) return; el.style.transform='perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    const g = el.querySelector<HTMLElement>('.tilt-glare'); if(g) g.style.opacity='0';
  };
  return (
    <div
      ref={ref}
      onMouseMove={handle}
      onMouseLeave={reset}
      style={{ transition:'transform .6s var(--easing-standard)', transformStyle:'preserve-3d', ...style }}
      {...rest}
    >
      {glare && <div className="tilt-glare" style={{ position:'absolute', inset:0, borderRadius:'inherit', pointerEvents:'none', opacity:0, mixBlendMode:'overlay', transition:'opacity .6s' }} />}
      {children}
    </div>
  );
};
export default Tilt;
