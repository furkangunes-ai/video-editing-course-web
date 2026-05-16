import React from 'react';

export const CameraBlur = () => {
  return (
    <>
      <div className="camera-blur top" aria-hidden="true"></div>
      <div className="camera-blur bottom" aria-hidden="true"></div>

      <style>{`
        .camera-blur {
          position: fixed;
          left: 0;
          width: 100%;
          height: 22vh;
          z-index: 800;
          pointer-events: none;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          will-change: backdrop-filter;
        }

        .camera-blur.top {
          top: 0;
          mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
          -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
        }

        .camera-blur.bottom {
          bottom: 0;
          mask-image: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
          -webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
        }

        @media (max-width: 768px) {
          .camera-blur {
            height: 12vh;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .camera-blur {
            display: none;
          }
        }
      `}</style>
    </>
  );
};
