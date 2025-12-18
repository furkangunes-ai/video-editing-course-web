import React from 'react';

export const RevealText = ({ visibleText, hiddenText, className = "" }) => {
    return (
        <span className={`reveal-text-container ${className}`}>
            <span className="reveal-text-visible">{visibleText}</span>
            <span className="reveal-text-hidden">{hiddenText}</span>

            <style>{`
        .reveal-text-container {
          position: relative;
          display: inline-block;
          cursor: pointer;
          overflow: hidden;
          vertical-align: bottom;
        }

        .reveal-text-visible {
          display: inline-block;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
        }

        .reveal-text-hidden {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center; /* Or flex-start depending on alignment needs */
          transform: translateY(100%);
          opacity: 0;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
          color: var(--color-primary); /* Highlight color for hidden text */
          font-weight: 700;
        }

        .reveal-text-container:hover .reveal-text-visible {
          transform: translateY(-100%);
          opacity: 0;
        }

        .reveal-text-container:hover .reveal-text-hidden {
          transform: translateY(0);
          opacity: 1;
        }
      `}</style>
        </span>
    );
};
