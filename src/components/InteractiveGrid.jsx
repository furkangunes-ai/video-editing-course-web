import React, { useEffect, useState } from 'react';

export const InteractiveGrid = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="interactive-grid-container">
            {/* Base Grid (Always visible, dim) */}
            <div className="grid-layer base-grid"></div>

            {/* Highlight Grid (Revealed by mouse) */}
            <div
                className="grid-layer highlight-grid"
                style={{
                    maskImage: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
                    WebkitMaskImage: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
                }}
            ></div>

            <style>{`
        .interactive-grid-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1; /* Behind everything */
          pointer-events: none;
          overflow: hidden;
          background-color: #050505; /* Deep dark background */
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
        }
      `}</style>
        </div>
    );
};
