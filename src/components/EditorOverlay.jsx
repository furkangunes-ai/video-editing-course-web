import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useMediaQuery';

export const EditorOverlay = () => {
    const timecodeRef = useRef(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        const el = timecodeRef.current;
        if (!el) return;

        let rafId = 0;
        let lastUpdate = 0;

        const update = (ts) => {
            if (ts - lastUpdate > 40) {
                const now = new Date();
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');
                const frames = String(Math.floor(now.getMilliseconds() / 40)).padStart(2, '0');
                el.textContent = `${hours}:${minutes}:${seconds}:${frames}`;
                lastUpdate = ts;
            }
            rafId = requestAnimationFrame(update);
        };

        rafId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(rafId);
    }, []);

    return (
        <div className="editor-overlay" aria-hidden="true">
            <div className="safe-margin top-left"></div>
            <div className="safe-margin top-right"></div>
            <div className="safe-margin bottom-left"></div>
            <div className="safe-margin bottom-right"></div>

            <div className="rec-indicator">
                <div className={`rec-dot ${reducedMotion ? 'static' : ''}`}></div>
                <span>REC</span>
            </div>

            <div ref={timecodeRef} className="timecode-display">00:00:00:00</div>

            <div className="center-crosshair"></div>

            <style>{`
        .editor-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 900;
          padding: 2rem;
        }

        .safe-margin {
          position: absolute;
          width: 40px;
          height: 40px;
          border-color: rgba(255, 255, 255, 0.2);
          border-style: solid;
        }

        .top-left { top: 2rem; left: 2rem; border-width: 2px 0 0 2px; }
        .top-right { top: 2rem; right: 2rem; border-width: 2px 2px 0 0; }
        .bottom-left { bottom: 2rem; left: 2rem; border-width: 0 0 2px 2px; }
        .bottom-right { bottom: 2rem; right: 2rem; border-width: 0 2px 2px 0; }

        .rec-indicator {
          position: absolute;
          top: 3rem;
          left: 4rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #ff4d4d;
          font-family: monospace;
          font-weight: 700;
          font-size: 1.2rem;
          letter-spacing: 2px;
        }

        .rec-dot {
          width: 12px;
          height: 12px;
          background-color: #ff4d4d;
          border-radius: 50%;
          animation: blink 2s infinite;
        }

        .rec-dot.static { animation: none; }

        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }

        .timecode-display {
          position: absolute;
          bottom: 3rem;
          right: 4rem;
          font-family: monospace;
          font-size: 1.5rem;
          color: var(--color-primary);
          text-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
          letter-spacing: 2px;
        }

        .center-crosshair {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          transform: translate(-50%, -50%);
        }

        .center-crosshair::before,
        .center-crosshair::after {
          content: '';
          position: absolute;
          background-color: rgba(255, 255, 255, 0.1);
        }

        .center-crosshair::before { top: 9px; left: 0; width: 100%; height: 2px; }
        .center-crosshair::after { top: 0; left: 9px; width: 2px; height: 100%; }

        @media (max-width: 768px) {
          .editor-overlay { padding: 1rem; }
          .safe-margin { width: 20px; height: 20px; }
          .top-left { top: 1rem; left: 1rem; }
          .top-right { top: 1rem; right: 1rem; }
          .bottom-left { bottom: 1rem; left: 1rem; }
          .bottom-right { bottom: 1rem; right: 1rem; }
          .rec-indicator { top: 1.5rem; left: 2.5rem; font-size: 1rem; }
          .timecode-display { bottom: 1.5rem; right: 2.5rem; font-size: 1rem; }
        }
      `}</style>
        </div>
    );
};
