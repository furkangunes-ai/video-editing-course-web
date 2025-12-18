import React, { useEffect, useState } from 'react';

export const TimelineProgress = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = totalScroll / windowHeight;
            setScrollProgress(scroll);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="timeline-container">
            {/* Timeline Tracks Background */}
            <div className="timeline-tracks">
                <div className="track-line"></div>
                <div className="track-line"></div>
                <div className="track-line"></div>
            </div>

            {/* Progress Bar / Playhead */}
            <div
                className="timeline-playhead"
                style={{ width: `${scrollProgress * 100}%` }}
            >
                <div className="playhead-knob"></div>
            </div>

            <style>{`
        .timeline-container {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 12px;
          background: #0f0f0f;
          z-index: 1001;
          border-top: 1px solid #333;
        }

        .timeline-tracks {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          opacity: 0.3;
        }

        .track-line {
          width: 100%;
          height: 1px;
          background: #333;
        }

        .timeline-playhead {
          height: 100%;
          background: rgba(0, 255, 157, 0.3);
          position: relative;
          transition: width 0.1s linear;
        }

        .playhead-knob {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 16px;
          background: var(--color-primary);
          box-shadow: 0 0 10px var(--color-primary);
          border-radius: 2px;
        }
      `}</style>
        </div>
    );
};
