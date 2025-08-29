import React, { useEffect, useRef } from 'react';

interface ParticlesProps { count?: number; }


const Particles: React.FC<ParticlesProps> = ({ count = 40 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvasRef.current; if(!c) return; const ctx = c.getContext('2d', { alpha: true }); if(!ctx) return;
    
    const setSize = () => {
      const pr = Math.min(window.devicePixelRatio || 1, 1.5);
      c.style.width = window.innerWidth + 'px';
      c.style.height = window.innerHeight + 'px';
      c.width = Math.floor(window.innerWidth * pr);
      c.height = Math.floor(window.innerHeight * pr);
      ctx.setTransform(pr,0,0,pr,0,0);
    };
    setSize();
    window.addEventListener('resize', setSize);

    const particles = Array.from({ length: count }).map(()=>({
      x: Math.random()*window.innerWidth,
      y: Math.random()*window.innerHeight,
      r: Math.random()*2+0.7, 
      vx: (Math.random()-0.5)*0.1,
      vy: (Math.random()-0.5)*0.1,
      phase: Math.random()*Math.PI*2
    }));

    let lastDraw = 0;
    const targetFPS = 28; 
    const frameInterval = 1000/targetFPS;
    let raf:number; let active = true; let hidden = false; let idle = false;
    let lastInteraction = Date.now();

    const markInteraction = () => { lastInteraction = Date.now(); if (idle) idle = false; };
    window.addEventListener('pointermove', markInteraction, { passive:true });
    window.addEventListener('keydown', markInteraction);

    const checkIdle = () => { idle = Date.now() - lastInteraction > 15000; }; 
    const idleTimer = setInterval(checkIdle, 5000);

    const heroBoundary = () => window.scrollY < window.innerHeight * 1.2; 

    const loop = (ts: number) => {
      if(!active) return;
      raf = requestAnimationFrame(loop);
      if (hidden) return; 
      if (!heroBoundary()) return; 
      if (idle && (ts - lastDraw) < 800) return; 
      if (!idle && (ts - lastDraw) < frameInterval) return;
      lastDraw = ts;
      ctx.clearRect(0,0,c.width,c.height);
      ctx.globalCompositeOperation='lighter';
      particles.forEach(p=>{
        p.x += p.vx; p.y += p.vy;
        if(p.x< -20) p.x = window.innerWidth + 20; else if(p.x> window.innerWidth+20) p.x = -20;
        if(p.y< -20) p.y = window.innerHeight + 20; else if(p.y> window.innerHeight+20) p.y = -20;
        p.phase += 0.01; if(p.phase>Math.PI*2) p.phase -= Math.PI*2;
        const pulse = (Math.sin(p.phase) + 1)/2; 
        const rad = p.r * (1 + pulse*0.35);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad*3.2);
        g.addColorStop(0, `rgba(99,102,241,${0.42 + pulse*0.25})`);
        g.addColorStop(1, 'rgba(99,102,241,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x,p.y,rad*3.2,0,Math.PI*2);
        ctx.fill();
      });
    };
    raf = requestAnimationFrame(loop);

    const visHandler = () => { hidden = document.hidden; if(!hidden && active) { lastDraw = 0; raf = requestAnimationFrame(loop); } };
    document.addEventListener('visibilitychange', visHandler);

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      clearInterval(idleTimer);
      window.removeEventListener('resize', setSize);
      window.removeEventListener('pointermove', markInteraction);
      window.removeEventListener('keydown', markInteraction);
      document.removeEventListener('visibilitychange', visHandler);
    };
  }, [count]);

  return <canvas ref={canvasRef} style={{ position:'fixed', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }} />;
};

export default Particles;
