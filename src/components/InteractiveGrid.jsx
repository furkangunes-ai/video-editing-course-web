import React, { useEffect, useRef } from 'react';
import { useIsTouchDevice, useReducedMotion } from '../hooks/useMediaQuery';

export const InteractiveGrid = () => {
    const highlightRef = useRef(null);
    const isTouch = useIsTouchDevice();
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        if (isTouch || reducedMotion) return;
        const el = highlightRef.current;
        if (!el) return;

        let mouseX = 0;
        let mouseY = 0;
        let pending = false;

        const apply = () => {
            const mask = `radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;
            el.style.maskImage = mask;
            el.style.webkitMaskImage = mask;
            pending = false;
        };

        const onMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!pending) {
                pending = true;
                requestAnimationFrame(apply);
            }
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMove);
    }, [isTouch, reducedMotion]);

    return (
        <div className="interactive-grid-container" aria-hidden="true">
            <div className="grid-layer base-grid"></div>
            {!isTouch && !reducedMotion && (
                <div ref={highlightRef} className="grid-layer highlight-grid"></div>
            )}

            <style>{`
        .interactive-grid-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          pointer-events: none;
          overflow: hidden;
          background-color: #050505;
        }

        .grid-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: 50px 50px;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }

        .base-grid {
          opacity: 0.4;
        }

        .highlight-grid {
          opacity: 1;
          background-image:
            linear-gradient(to right, rgba(0, 255, 157, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 157, 0.15) 1px, transparent 1px);
          filter: drop-shadow(0 0 2px rgba(0, 255, 157, 0.5));
          will-change: mask-image;
        }
      `}</style>
        </div>
    );
};
