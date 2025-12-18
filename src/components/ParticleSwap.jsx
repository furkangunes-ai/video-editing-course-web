import React, { useState } from 'react';

export const ParticleSwap = ({ text, hiddenText, className = "" }) => {
    const [isHovering, setIsHovering] = useState(false);

    // Split text into characters for the particle effect
    const chars = text.split('').map((char, index) => ({
        char,
        // Generate random dispersion values for each character
        style: {
            '--x': `${(Math.random() - 0.5) * 100}px`,
            '--y': `${(Math.random() - 0.5) * 100}px`,
            '--r': `${(Math.random() - 0.5) * 360}deg`,
            '--d': `${Math.random() * 0.5}s`, // Random delay
        }
    }));

    return (
        <span
            className={`particle-swap-container ${className}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Original Text (Particles) */}
            <span className={`particle-text ${isHovering ? 'dispersing' : ''}`}>
                {chars.map((item, i) => (
                    <span key={i} className="particle-char" style={item.style}>
                        {item.char === ' ' ? '\u00A0' : item.char}
                    </span>
                ))}
            </span>

            {/* Hidden Text (Fade In) */}
            <span className={`hidden-text ${isHovering ? 'visible' : ''}`}>
                {hiddenText}
            </span>

            <style>{`
        .particle-swap-container {
          position: relative;
          display: inline-block;
          cursor: pointer;
        }

        .particle-text {
          display: inline-block;
          transition: opacity 0.3s;
        }

        .particle-char {
          display: inline-block;
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s;
          transform-origin: center;
        }

        .particle-text.dispersing .particle-char {
          transform: translate(var(--x), var(--y)) rotate(var(--r));
          opacity: 0;
        }

        .hidden-text {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center; /* Center the new text */
          opacity: 0;
          transform: scale(0.9) blur(10px);
          transition: all 0.5s ease-out;
          color: var(--color-primary);
          pointer-events: none; /* Let clicks pass through if needed */
          white-space: nowrap;
        }

        .hidden-text.visible {
          opacity: 1;
          transform: scale(1) blur(0);
        }
      `}</style>
        </span>
    );
};
