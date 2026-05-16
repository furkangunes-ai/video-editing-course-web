import React from 'react';
import { TrendingUp, Sparkles, ArrowRight, Gift } from 'lucide-react';

export const CheckoutBundle = ({ currentProduct, suggestedProduct, onSwitch }) => {
  if (!suggestedProduct) return null;
  const extra = suggestedProduct.price - (currentProduct?.price || 0);
  const extraDisplay = extra > 0 ? `+${extra.toLocaleString('tr-TR')} TL ekle` : null;

  return (
    <div className="bundle-card">
      <div className="bundle-ribbon">
        <Sparkles size={14} />
        <span>EN POPÜLER YÜKSELTME</span>
      </div>

      <div className="bundle-head">
        <div className="bundle-icon">
          <TrendingUp size={22} />
        </div>
        <div>
          <h3 className="bundle-title">{suggestedProduct.name}</h3>
          <p className="bundle-subtitle">{suggestedProduct.description}</p>
        </div>
      </div>

      <ul className="bundle-features">
        {suggestedProduct.features.slice(0, 4).map((f) => (
          <li key={f}>
            <Gift size={14} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="bundle-footer">
        <div className="bundle-price">
          <span className="bundle-price-old">{suggestedProduct.originalPrice.toLocaleString('tr-TR')} TL</span>
          <span className="bundle-price-current">{suggestedProduct.price.toLocaleString('tr-TR')} TL</span>
          {extraDisplay && (
            <span className="bundle-price-delta">{extraDisplay}</span>
          )}
        </div>
        <button type="button" onClick={() => onSwitch(suggestedProduct.id)} className="bundle-cta">
          Bu pakete yükselt
          <ArrowRight size={16} />
        </button>
      </div>

      <style>{`
        .bundle-card {
          position: relative;
          padding: 1.5rem 1.5rem 1.25rem;
          background: linear-gradient(135deg, rgba(0, 255, 157, 0.08) 0%, rgba(112, 0, 255, 0.06) 100%);
          border: 1px solid rgba(0, 255, 157, 0.35);
          border-radius: 1rem;
          color: #fff;
          font-family: var(--font-sans);
        }
        .bundle-ribbon {
          position: absolute;
          top: -12px;
          left: 1.5rem;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.25rem 0.75rem;
          background: linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%);
          color: #000;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 1px;
          border-radius: 999px;
          box-shadow: 0 4px 14px rgba(0, 255, 157, 0.35);
        }
        .bundle-head {
          display: flex;
          gap: 0.85rem;
          align-items: flex-start;
          margin-top: 0.5rem;
          margin-bottom: 1rem;
        }
        .bundle-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 255, 157, 0.15);
          color: #00ff9d;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bundle-title {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 700;
        }
        .bundle-subtitle {
          margin: 0.2rem 0 0;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.65);
          line-height: 1.4;
        }
        .bundle-features {
          list-style: none;
          padding: 0;
          margin: 0 0 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .bundle-features li {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.85);
        }
        .bundle-features svg { color: #00ff9d; flex-shrink: 0; }
        .bundle-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          padding-top: 0.85rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .bundle-price {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .bundle-price-old {
          color: rgba(255, 255, 255, 0.4);
          text-decoration: line-through;
          font-size: 0.85rem;
        }
        .bundle-price-current {
          color: #fff;
          font-size: 1.25rem;
          font-weight: 700;
        }
        .bundle-price-delta {
          font-size: 0.75rem;
          color: #00ff9d;
          background: rgba(0, 255, 157, 0.1);
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
        }
        .bundle-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1rem;
          background: linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%);
          color: #000;
          border: none;
          font-weight: 700;
          font-size: 0.85rem;
          border-radius: 0.6rem;
          cursor: pointer;
          font-family: inherit;
          transition: transform 0.15s ease, box-shadow 0.2s ease;
        }
        .bundle-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0, 255, 157, 0.35);
        }

        @media (max-width: 600px) {
          .bundle-footer { flex-direction: column; align-items: stretch; }
          .bundle-cta { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
};
