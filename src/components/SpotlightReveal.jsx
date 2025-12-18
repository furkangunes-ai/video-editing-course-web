import React, { useRef, useState, useEffect } from 'react';

export const SpotlightReveal = ({ text, hiddenText, className = "" }) => {
    const containerRef = useRef(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    return (
        <span
            ref={containerRef}
            className={`spotlight-reveal-container ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Bottom Layer (Hidden Text - Always there, but covered by Top Layer) */}
            <span className="spotlight-layer bottom-layer">
                {hiddenText}
            </span>

            {/* Top Layer (Visible Text - Masked by "hole" on hover) */}
            <span
                className="spotlight-layer top-layer"
                style={{
                    maskImage: isHovering
                        ? `radial-gradient(circle 750px at ${pos.x}px ${pos.y}px, transparent 740px, black 750px)`
                        : 'none',
                    WebkitMaskImage: isHovering
                        ? `radial-gradient(circle 750px at ${pos.x}px ${pos.y}px, transparent 740px, black 750px)`
                        : 'none'
                }}
            >
                {text}
            </span>

            <style>{`
        .spotlight-reveal-container {
          position: relative;
          display: inline-block;
          cursor: default;
        }
        
        .spotlight-layer {
          font-weight: inherit;
          font-size: inherit;
          line-height: inherit;
          display: inline-block;
        }

        .bottom-layer {
          color: var(--color-primary);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          white-space: nowrap;
          
          /* Center the hidden text if it's shorter/longer, or align left */
          display: flex;
          align-items: center;
          /* justify-content: center;  Remove this if you want left alignment */
        }

        .top-layer {
          color: inherit;
          position: relative;
          z-index: 2;
          white-space: nowrap;
          background-color: var(--color-bg); /* Ensure it covers the bottom layer if needed, or just rely on opacity */
          /* Actually, for text, we just need the text itself to be opaque. 
             If the background is transparent, we see through. 
             But here we want the Top Text to cover the Bottom Text.
             Since they are just text, they overlap. 
             We need the Top Text to be fully opaque pixels. */
        }
      `}</style>
        </span>
    );
};
