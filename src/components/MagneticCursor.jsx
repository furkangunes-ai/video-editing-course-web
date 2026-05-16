import React, { useEffect, useRef } from 'react';
import { useIsTouchDevice, useReducedMotion } from '../hooks/useMediaQuery';

const TRAIL_SIZE = 30;
const TRAIL_LIFETIME = 500;

export const MagneticCursor = () => {
  const isTouch = useIsTouchDevice();
  const reducedMotion = useReducedMotion();
  const containerRef = useRef(null);

  useEffect(() => {
    if (isTouch || reducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const dots = [];
    for (let i = 0; i < TRAIL_SIZE; i++) {
      const dot = document.createElement('div');
      dot.className = 'cursor-trail-dot';
      dot.style.opacity = '0';
      container.appendChild(dot);
      dots.push({ el: dot, x: 0, y: 0, born: 0, active: false });
    }

    const mouse = { x: 0, y: 0 };
    const emitter = { x: 0, y: 0 };
    let initialized = false;
    let cursor = 0;
    let lastEmit = 0;
    let rafId = 0;

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!initialized) {
        emitter.x = mouse.x;
        emitter.y = mouse.y;
        initialized = true;
      }
    };

    const tick = () => {
      const now = performance.now();
      const ease = 0.15;
      const dx = mouse.x - emitter.x;
      const dy = mouse.y - emitter.y;

      if (initialized && (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5)) {
        emitter.x += dx * ease;
        emitter.y += dy * ease;

        if (now - lastEmit > 16) {
          const slot = dots[cursor];
          slot.x = emitter.x;
          slot.y = emitter.y;
          slot.born = now;
          slot.active = true;
          slot.el.style.transform = `translate(${slot.x - 4}px, ${slot.y - 4}px) scale(1)`;
          slot.el.style.opacity = '0.7';
          cursor = (cursor + 1) % TRAIL_SIZE;
          lastEmit = now;
        }
      }

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        if (!d.active) continue;
        const age = now - d.born;
        if (age >= TRAIL_LIFETIME) {
          d.active = false;
          d.el.style.opacity = '0';
          continue;
        }
        const t = age / TRAIL_LIFETIME;
        const opacity = 0.7 * (1 - t);
        const scale = 1 - t * 0.8;
        d.el.style.opacity = opacity.toFixed(3);
        d.el.style.transform = `translate(${d.x - 4}px, ${d.y - 4}px) scale(${scale.toFixed(3)})`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
      dots.forEach((d) => d.el.remove());
    };
  }, [isTouch, reducedMotion]);

  if (isTouch || reducedMotion) return null;

  return (
    <>
      <div ref={containerRef} className="cursor-trail-layer" aria-hidden="true" />
      <style>{`
        .cursor-trail-layer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
        }
        .cursor-trail-dot {
          position: absolute;
          top: 0;
          left: 0;
          width: 8px;
          height: 8px;
          background: #00F3FF;
          border-radius: 50%;
          pointer-events: none;
          box-shadow: 0 0 10px #00F3FF, 0 0 20px #00F3FF;
          mix-blend-mode: screen;
          will-change: transform, opacity;
        }
      `}</style>
    </>
  );
};
