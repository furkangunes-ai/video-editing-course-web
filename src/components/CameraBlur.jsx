import React from 'react';

export const CameraBlur = () => {
  return (
    <>
      <div className="camera-blur top"></div>
      <div className="camera-blur bottom"></div>

      <style>{`
        .camera-blur {
          position: fixed;
          left: 0;
          width: 100%;
          height: 30vh; /* Adjusted to 30% as requested */
          z-index: 800;
          pointer-events: none;
          backdrop-filter: blur(20px); /* Significantly increased blur for creamy Gaussian look */
          -webkit-backdrop-filter: blur(20px);
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
      `}</style>
    </>
  );
};
