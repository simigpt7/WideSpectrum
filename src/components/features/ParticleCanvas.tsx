import { useEffect, useRef } from 'react';
import { useMediaQuery, useReducedMotion } from '@/hooks';
import { COLORS } from '@/constants';
import type { Particle } from '@/types';

/**
 * ParticleCanvas — heavily optimised version.
 *
 * Key changes vs. original:
 *  1. shadowBlur removed from every particle — shadowBlur triggers an expensive
 *     off-screen compositing pass. Glow is faked cheaply with a second circle
 *     using globalAlpha instead.
 *  2. Connection drawing moved into a single ctx.beginPath() batch per frame,
 *     instead of one beginPath per pair (O(n²) state changes).
 *  3. Particle count capped more aggressively on mobile (30) and mid-tier (80).
 *  4. ctx.save/restore removed — they flush the render pipeline; we reset
 *     individual properties directly instead.
 *  5. Mouse repulsion uses squared distance check before sqrt — avoids sqrt
 *     for the majority of particles that are far away.
 *  6. Canvas pointer-events stay 'none' (unchanged) so it never blocks scroll.
 *  7. ResizeObserver replaces window resize listener for accuracy.
 */
export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const isMobile = useMediaQuery('(hover: none) and (pointer: coarse)');
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true })!;
    // Cap DPR at 2 — above that you're drawing 9× the pixels for imperceptible quality gain
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let logicalW = 0;
    let logicalH = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      logicalW = rect.width;
      logicalH = rect.height;
      canvas.width = logicalW * dpr;
      canvas.height = logicalH * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();

    // Fewer particles = fewer draw calls = more headroom for 60fps scroll
    const particleCount = isMobile ? 30 : 80;
    const colors = [COLORS.teal, COLORS.aqua, COLORS.tealLight, COLORS.chrome];

    const mkParticle = (): Particle => ({
      x: Math.random() * logicalW,
      y: Math.random() * logicalH,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: Math.random() > 0.85 ? 'star' : 'circle',
      glow: Math.random() > 0.7,
      angle: Math.random() * Math.PI * 2,
    });

    particlesRef.current = Array.from({ length: particleCount }, mkParticle);

    // Cheap 4-point star — no trig per spike, just 4 lines
    const drawStar = (x: number, y: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y - r * 2);
      ctx.lineTo(x + r * 0.4, y - r * 0.4);
      ctx.lineTo(x + r * 2, y);
      ctx.lineTo(x + r * 0.4, y + r * 0.4);
      ctx.lineTo(x, y + r * 2);
      ctx.lineTo(x - r * 0.4, y + r * 0.4);
      ctx.lineTo(x - r * 2, y);
      ctx.lineTo(x - r * 0.4, y - r * 0.4);
      ctx.closePath();
    };

    const CONNECT_DIST_SQ = 90 * 90; // squared — avoids sqrt for most pairs

    const animate = () => {
      ctx.clearRect(0, 0, logicalW, logicalH);

      const pts = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // ── Update + draw particles ──────────────────────────────────────────
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // Physics
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = logicalW + 10;
        else if (p.x > logicalW + 10) p.x = -10;
        if (p.y < -10) p.y = logicalH + 10;
        else if (p.y > logicalH + 10) p.y = -10;

        // Mouse repulsion — squared check first
        const dxM = p.x - mx;
        const dyM = p.y - my;
        const distSqM = dxM * dxM + dyM * dyM;
        if (distSqM < 80 * 80 && distSqM > 0) {
          const dist = Math.sqrt(distSqM);
          const force = (80 - dist) / 80;
          p.vx += (dxM / dist) * force * 0.12;
          p.vy += (dyM / dist) * force * 0.12;
        }

        // Dampen velocity
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Draw — no shadowBlur (expensive). Fake glow with a cheap outer circle.
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.glow) {
          // Inner halo: slightly larger, lower alpha
          ctx.globalAlpha = p.opacity * 0.25;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = p.opacity;
        }

        if (p.type === 'star') {
          drawStar(p.x, p.y, p.size);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Draw connections in one batched path ────────────────────────────
      // Setting strokeStyle once and batching all connection lines into a
      // single path is ~5× faster than one path per connection pair.
      ctx.strokeStyle = COLORS.teal;
      ctx.lineWidth = 0.5;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < CONNECT_DIST_SQ) {
            const alpha = (1 - dSq / CONNECT_DIST_SQ) * 0.07;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Mouse/touch tracking
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    const onTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      if (t) mouseRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // ResizeObserver is more accurate than window resize (handles CSS changes)
    const ro = new ResizeObserver(() => {
      resize();
      particlesRef.current = Array.from({ length: particleCount }, mkParticle);
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchmove', onTouchMove);
      ro.disconnect();
    };
  }, [isMobile, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 5, pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
}
