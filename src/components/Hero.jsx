import React, { useState } from 'react';
import { Play, ArrowRight, X } from 'lucide-react';

export const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);

  // Bunny.net video - Library ID: 289541, Video ID: 0001d9d3-21b1-476c-8a20-348ca53c570c
  const bunnyVideoUrl = "https://iframe.mediadelivery.net/embed/289541/0001d9d3-21b1-476c-8a20-348ca53c570c?autoplay=true&preload=true";

  return (
    <section className="section hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="badge">
              <span className="badge-dot"></span>
              Yeni Başlayanlar İçin Özel
            </div>
            <h1 className="hero-title">
              Video Editörlüğü ile <br />
              <span className="text-gradient-primary">Gelirinizi İkiye Katlayın</span>
            </h1>
            <p className="hero-subtitle">
              Editörlük, doğru stratejilerle global bir gelir yoludur.
              Güzel yemek için en pahalı malzemeler şart değil.
            </p>
            <div className="hero-actions">
              <a
                href="https://wa.me/905011411940"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Hemen Başla <ArrowRight size={20} />
              </a>
              <button className="btn btn-outline" onClick={() => setShowVideo(true)}>
                <Play size={20} /> Örnek Ders İzle
              </button>
            </div>
            <p className="hero-guarantee">
              * %96 Memnuniyet Garantisi
            </p>
          </div>

          <div className="hero-visual">
            <div className="visual-card">
              <div className="visual-glow"></div>
              <div className="visual-content">
                {/* Video Container */}
                <div className="video-wrapper" onClick={() => setShowVideo(true)}>
                  <img
                    src="/hero-image.png"
                    alt="Video Editörlüğü Arayüzü"
                    className="hero-image"
                  />
                  <div className="play-button-wrapper">
                    <div className="play-button">
                      <Play size={32} />
                    </div>
                    <span className="video-hint">Örnek Dersi İzle</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Modal */}
          {showVideo && (
            <div className="video-modal" onClick={() => setShowVideo(false)}>
              <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="video-close-btn" onClick={() => setShowVideo(false)}>
                  <X size={24} />
                </button>
                <iframe
                  src={bunnyVideoUrl}
                  className="hero-video-iframe"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  title="Örnek Ders"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .hero {
          min-height: 90vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding-top: 120px; /* Space for header if added later */
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          color: var(--color-text-muted);
          margin-bottom: 1.5rem;
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          background-color: var(--color-primary);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--color-primary);
        }

        .hero-title {
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--color-text-muted);
          margin-bottom: 2.5rem;
          max-width: 500px;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }



        .hero-guarantee {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          opacity: 0.7;
        }

        .hero-visual {
          position: relative;
        }

        .visual-card {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--color-border);
          aspect-ratio: 16/9;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }

        .visual-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .visual-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, rgba(112, 0, 255, 0.2) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.8;
        }

        .hero-video {
          width: 100%;
          height: 100%;
          border: none;
        }

        .video-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .play-button-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
          background: rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: background 0.3s ease;
          gap: 1rem;
        }

        .video-hint {
          color: white;
          font-size: 0.9rem;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
        }

        .play-button-wrapper:hover .video-hint {
          opacity: 1;
          transform: translateY(0);
        }

        .play-button-wrapper:hover {
          background: rgba(0, 0, 0, 0.1);
        }

        .play-button {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          transition: transform 0.3s ease;
        }

        .play-button-wrapper:hover .play-button {
          transform: scale(1.1);
          background: var(--color-primary);
          color: black;
          border-color: var(--color-primary);
        }

        /* Video Modal Styles */
        .video-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .video-modal-content {
          position: relative;
          width: 90%;
          max-width: 1200px;
          aspect-ratio: 16/9;
          background: #000;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 25px 80px rgba(0, 255, 157, 0.2);
          border: 1px solid rgba(0, 255, 157, 0.3);
        }

        .video-close-btn {
          position: absolute;
          top: -50px;
          right: 0;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .video-close-btn:hover {
          background: var(--color-primary);
          color: black;
          border-color: var(--color-primary);
          transform: rotate(90deg);
        }

        .hero-video-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        @media (max-width: 768px) {
          .hero {
             padding-top: 100px;
             min-height: auto;
             padding-bottom: 4rem;
          }

          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 3rem;
          }

          .hero-title {
            font-size: 2.2rem;
            margin-bottom: 1rem;
          }

          .hero-subtitle {
            margin: 0 auto 2rem;
            font-size: 1.1rem;
          }

          .hero-actions {
            justify-content: center;
            flex-direction: column;
            width: 100%;
          }
          
          .btn {
            width: 100%;
          }
          
          .hero-visual {
            margin-top: 2rem;
          }

          .video-modal-content {
            width: 95%;
          }

          .video-close-btn {
            top: -45px;
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </section>
  );
};
