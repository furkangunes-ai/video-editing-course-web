import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';
import { useFlashSale } from '../hooks/useFlashSale';

const pad = (n) => String(n).padStart(2, '0');

export const FlashSaleCountdown = ({ variant = 'banner' }) => {
  const { config, remaining, visible } = useFlashSale();
  if (!visible) return null;

  const unit = (label, value) => (
    <div className="flash-unit">
      <span className="flash-unit-value">{pad(value)}</span>
      <span className="flash-unit-label">{label}</span>
    </div>
  );

  const isCompact = variant === 'compact';

  return (
    <div className={`flash-sale flash-sale-${variant}`} role="region" aria-live="polite">
      <div className="flash-sale-label">
        <Flame size={isCompact ? 14 : 18} />
        <span>{config.label || 'Sınırlı Süreli Kampanya'}</span>
      </div>
      <div className="flash-sale-timer" aria-label="Geri sayım">
        {!isCompact && remaining.days > 0 && unit('Gün', remaining.days)}
        {unit('Saat', remaining.hours)}
        <span className="flash-colon">:</span>
        {unit('Dakika', remaining.minutes)}
        <span className="flash-colon">:</span>
        {unit('Saniye', remaining.seconds)}
      </div>
      {config.ctaText && config.ctaUrl && (
        <a
          href={config.ctaUrl}
          target={config.ctaUrl.startsWith('http') ? '_blank' : undefined}
          rel={config.ctaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="flash-sale-cta"
        >
          {config.ctaText}
          <ArrowRight size={16} />
        </a>
      )}

      <style>{`
        .flash-sale {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          padding: 0.85rem 1.5rem;
          background: linear-gradient(90deg, rgba(255, 77, 77, 0.18) 0%, rgba(255, 51, 51, 0.10) 50%, rgba(255, 77, 77, 0.18) 100%);
          border: 1px solid rgba(255, 77, 77, 0.4);
          border-radius: 999px;
          color: #ff6b6b;
          font-family: var(--font-sans);
          flex-wrap: wrap;
          max-width: 100%;
        }
        .flash-sale-banner { width: max-content; margin: 1rem auto; }
        .flash-sale-compact { padding: 0.5rem 1rem; font-size: 0.85rem; gap: 0.75rem; }
        .flash-sale-label {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .flash-sale-compact .flash-sale-label { font-size: 0.75rem; }
        .flash-sale-timer {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        .flash-unit {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          min-width: 40px;
        }
        .flash-sale-compact .flash-unit { min-width: 28px; }
        .flash-unit-value {
          font-family: monospace;
          font-weight: 800;
          font-size: 1.4rem;
          line-height: 1;
          color: #fff;
        }
        .flash-sale-compact .flash-unit-value { font-size: 1rem; }
        .flash-unit-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          opacity: 0.7;
          margin-top: 0.2rem;
        }
        .flash-sale-compact .flash-unit-label { font-size: 0.55rem; }
        .flash-colon { font-family: monospace; font-weight: 800; font-size: 1.2rem; opacity: 0.5; }
        .flash-sale-compact .flash-colon { font-size: 0.9rem; }
        .flash-sale-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.45rem 1rem;
          background: linear-gradient(135deg, #ff4d4d 0%, #cc0000 100%);
          color: #fff;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.85rem;
          border-radius: 999px;
          transition: transform 0.15s ease, box-shadow 0.2s ease;
        }
        .flash-sale-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255, 77, 77, 0.4);
        }

        @media (max-width: 600px) {
          .flash-sale-banner { padding: 0.6rem 1rem; gap: 0.6rem; }
          .flash-unit-value { font-size: 1.1rem; }
        }
      `}</style>
    </div>
  );
};
