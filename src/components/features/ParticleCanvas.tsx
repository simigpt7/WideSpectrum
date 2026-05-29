import { useEffect, useRef } from 'react';
import { useMediaQuery, useReducedMotion } from '@/hooks';
import { COLORS } from '@/constants';
import type { Particle } from '@/types';

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const isMobile = useMediaQuery('(hover: none) and (pointer: coarse)');
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true })!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();

    const particleCount = isMobile ? 50 : 120;
    const colors = [COLORS.teal, COLORS.aqua, COLORS.tealLight, COLORS.chrome, COLORS.gold];

    const createParticle = (width: number, height: number): Particle => {
      const type = Math.random() > 0.7 ? 'star' : Math.random() > 0.5 ? 'line' : 'circle';
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        type,
        glow: Math.random() > 0.6,
        angle: Math.random() * Math.PI * 2,
      };
    };

    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    particlesRef.current = Array.from({ length: particleCount }, () =>
      createParticle(width, height)
    );

    const drawStar = (x: number, y: number, size: number) => {
      const spikes = 4;
      const outerRadius = size * 2;
      const innerRadius = size;
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(x, y - outerRadius);
      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
        rot += step;
        ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
        rot += step;
      }
      ctx.closePath();
    };

    const animate = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const pts = particlesRef.current;

      pts.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Mouse repulsion
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          const force = (100 - dist) / 100;
          p.vx += (dx / dist) * force * 0.15;
          p.vy += (dy / dist) * force * 0.15;
        }

        // Decelerate
        p.vx *= 0.99;
        p.vy *= 0.99;

        ctx.globalAlpha = p.opacity;

        if (p.glow) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = p.color;
        }

        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;

        if (p.type === 'star') {
          drawStar(p.x, p.y, p.size);
          ctx.fill();
        } else if (p.type === 'line') {
          p.angle = (p.angle || 0) + 0.01;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(
            p.x + Math.cos(p.angle || 0) * p.size * 4,
            p.y + Math.sin(p.angle || 0) * p.size * 4
          );
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw connections
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = COLORS.teal;
            ctx.globalAlpha = (1 - d / 100) * 0.08;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      animate();
    }

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      if (clientX !== undefined && clientY !== undefined) {
        mouseRef.current = {
          x: clientX - rect.left,
          y: clientY - rect.top,
        };
      }
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onMouseMove, { passive: true });

    const handleResize = () => {
      resize();
      const newWidth = canvas.width / dpr;
      const newHeight = canvas.height / dpr;
      particlesRef.current = Array.from({ length: particleCount }, () =>
        createParticle(newWidth, newHeight)
      );
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    />
  );
}
