import React from 'react';
import { Play, ArrowRight } from 'lucide-react';

export const Hero = () => {
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
              <button className="btn btn-outline">
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
                <div className="video-wrapper">
                  <img
                    src="/hero-image.png"
                    alt="Video Editörlüğü Arayüzü"
                    className="hero-image"
                  />
                </div>
              </div>
            </div>
          </div>
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

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 3rem;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            margin: 0 auto 2rem;
          }

          .hero-actions {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};
