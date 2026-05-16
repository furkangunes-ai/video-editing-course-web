import React, { useState } from 'react';
import { Play, ArrowRight } from 'lucide-react';
import { VideoModal } from './VideoModal';
import { useSiteConfig } from '../hooks/useSiteConfig';

export const Hero = () => {
  const config = useSiteConfig();
  const [videoOpen, setVideoOpen] = useState(false);
  const whatsappUrl = `https://wa.me/${config.contact.whatsapp}`;

  return (
    <section className="section hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="badge">
              <span className="badge-dot"></span>
              {config.hero.badge}
            </div>
            <h1 className="hero-title">
              {config.hero.titleLine1} <br />
              <span className="text-gradient-primary">{config.hero.titleLine2}</span>
            </h1>
            <p className="hero-subtitle">{config.hero.subtitle}</p>
            <div className="hero-actions">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Hemen Başla <ArrowRight size={20} />
              </a>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setVideoOpen(true)}
              >
                <Play size={20} /> Örnek Ders İzle
              </button>
            </div>
            <p className="hero-guarantee">{config.hero.guaranteeText}</p>
          </div>

          <div className="hero-visual">
            <div
              className="visual-card"
              onClick={() => setVideoOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setVideoOpen(true)}
            >
              <div className="visual-glow"></div>
              <div className="visual-content">
                <div className="video-wrapper">
                  <picture>
                    <source srcSet="/hero-image.webp" type="image/webp" />
                    <img
                      src="/hero-image.png"
                      alt="Video Editörlüğü Arayüzü"
                      className="hero-image"
                      width="800"
                      height="450"
                      loading="eager"
                      fetchpriority="high"
                      decoding="async"
                    />
                  </picture>
                </div>
                <div className="play-overlay">
                  <div className="play-button">
                    <Play size={28} fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VideoModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoUrl={config.hero.sampleVideoUrl}
      />

      <style>{`
        .hero {
          min-height: 90vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding-top: 120px;
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
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .visual-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 255, 157, 0.15);
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

        .video-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(to top, rgba(0,0,0,0.3), transparent 50%);
          transition: background 0.3s;
        }

        .visual-card:hover .play-overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.1));
        }

        .play-button {
          width: 80px;
          height: 80px;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          transition: transform 0.3s ease, background 0.3s;
        }

        .visual-card:hover .play-button {
          transform: scale(1.1);
          background: var(--color-primary);
          color: black;
          border-color: var(--color-primary);
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

          .play-button {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>
    </section>
  );
};
