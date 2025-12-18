import React, { useEffect, useRef, useState } from 'react';

export const MagneticCursor = () => {
  const [trail, setTrail] = useState([]);

  // Refs for animation loop values to avoid re-renders
  const mousePos = useRef({ x: 0, y: 0 });
  const emitterPos = useRef({ x: 0, y: 0 });
  const timerRef = useRef();

  useEffect(() => {
    // Initialize positions
    const onFirstMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      emitterPos.current = { x: e.clientX, y: e.clientY };
      window.removeEventListener('mousemove', onFirstMove);
    };
    window.addEventListener('mousemove', onFirstMove);

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      // 1. Smoothly move the "emitter" towards the actual mouse position
      // Lower easing = more delay/lag (slower formation)
      const ease = 0.15;

      const dx = mousePos.current.x - emitterPos.current.x;
      const dy = mousePos.current.y - emitterPos.current.y;

      // Only emit if moving significantly
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        emitterPos.current.x += dx * ease;
        emitterPos.current.y += dy * ease;

        // 2. Emit a particle at the current LAGGING emitter position
        const newPoint = {
          x: emitterPos.current.x,
          y: emitterPos.current.y,
          id: Date.now() + Math.random(),
          createdAt: Date.now()
        };

        setTrail(prev => {
          // Keep array size manageable
          const newTrail = [...prev, newPoint];
          if (newTrail.length > 60) newTrail.shift();
          return newTrail;
        });
      }

      // 3. Cleanup old points
      const now = Date.now();
      setTrail(prev => prev.filter(point => now - point.createdAt < 500));

      timerRef.current = requestAnimationFrame(animate);
    };

    timerRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousemove', onFirstMove);
      cancelAnimationFrame(timerRef.current);
    };
  }, []);

  return (
    <>
      {trail.map((point) => (
        <div
          key={point.id}
          className="cursor-trail-dot"
          style={{
            left: point.x,
            top: point.y,
          }}
        />
      ))}
      <style>{`
        body, a, button, input, textarea {
          cursor: auto;
        }

        .cursor-trail-dot {
          position: fixed;
          width: 8px; /* Slightly larger for better visibility of lag */
          height: 8px;
          background: #00F3FF; 
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 9999;
          box-shadow: 
            0 0 10px #00F3FF, 
            0 0 20px #00F3FF;
          animation: fadeOut 0.5s linear forwards;
          mix-blend-mode: screen;
        }

        @keyframes fadeOut {
          0% {
            opacity: 0.7;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.2);
          }
        }

        @media (hover: none) {
          .cursor-trail-dot {
            display: none;
          }
        }
      `}</style>
    </>
  );
};
