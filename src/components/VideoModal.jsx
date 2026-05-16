import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const toEmbedUrl = (url) => {
  if (!url) return '';
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : url;
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1&rel=0`;
    }
    if (u.hostname.includes('vimeo.com')) {
      return `https://player.vimeo.com/video/${u.pathname.slice(1)}?autoplay=1`;
    }
    return url;
  } catch {
    return url;
  }
};

export const VideoModal = ({ open, onClose, videoUrl }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const embed = toEmbedUrl(videoUrl);

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="video-modal-close" onClick={onClose} aria-label="Kapat">
          <X size={24} />
        </button>
        {embed ? (
          <iframe
            src={embed}
            title="Örnek Ders"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="video-placeholder">
            <h3>Örnek ders yakında eklenecek.</h3>
            <p>Bu sırada WhatsApp üzerinden iletişime geçerek ön bilgi alabilirsin.</p>
          </div>
        )}
      </div>

      <style>{`
        .video-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          animation: fadeIn 0.2s ease;
        }

        .video-modal-content {
          position: relative;
          width: 100%;
          max-width: 960px;
          aspect-ratio: 16 / 9;
          background: #000;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid rgba(0, 255, 157, 0.3);
          box-shadow: 0 0 60px rgba(0, 255, 157, 0.2);
        }

        .video-modal-content iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }

        .video-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          backdrop-filter: blur(10px);
          transition: background 0.2s;
        }

        .video-modal-close:hover {
          background: rgba(255, 77, 77, 0.8);
        }

        .video-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--color-text);
          padding: 2rem;
          text-align: center;
          gap: 1rem;
        }

        .video-placeholder p {
          color: var(--color-text-muted);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 768px) {
          .video-modal-overlay { padding: 1rem; }
        }
      `}</style>
    </div>
  );
};
