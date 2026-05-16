import React, { useState } from 'react';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { useSiteConfig } from '../hooks/useSiteConfig';

export const Pricing = () => {
    const config = useSiteConfig();
    const [activePlan, setActivePlan] = useState('pro');

    const main = config.pricing.main;
    const skool = config.pricing.skool;
    const visiblePlans = [];
    if (main.enabled) visiblePlans.push('pro');
    if (skool.enabled) visiblePlans.push('skool');

    return (
        <section className="section pricing-section">
            <div className="container">
                <div className="pricing-wrapper">
                    {main.enabled && (
                        <div
                            className={`pricing-card main-card ${activePlan === 'pro' ? 'active' : 'inactive'}`}
                            onClick={() => setActivePlan('pro')}
                        >
                            <div className="pricing-header">
                                {main.badge && <div className="pricing-badge">{main.badge}</div>}
                                <h3 className="plan-name">{main.planName}</h3>

                                <div className="price-frame">
                                    {main.discountTag && (
                                        <div className="discount-tag">{main.discountTag}</div>
                                    )}
                                    {main.oldPrice && (
                                        <div className="old-price-wrapper">
                                            <span className="old-price">{main.oldPrice}</span>
                                            <div className="strikethrough-line"></div>
                                        </div>
                                    )}

                                    <div className="current-price-container">
                                        <span className="current-price">{main.currentPrice}</span>
                                    </div>
                                </div>

                                <p className="price-subtitle">{main.subtitle}</p>
                            </div>

                            <div className="pricing-features">
                                {main.features.map((f, i) => (
                                    <div key={i} className="feature-item">
                                        <Check size={20} className="feature-icon" />
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pricing-cta">
                                <a
                                    href={main.ctaUrl}
                                    target={main.ctaUrl.startsWith('http') ? '_blank' : undefined}
                                    rel={main.ctaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    className="btn btn-primary btn-block"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {main.ctaText} <ArrowRight size={20} />
                                </a>
                                {main.guaranteeText && (
                                    <p className="guarantee-text">
                                        <ShieldCheck size={16} className="inline-icon" />
                                        {main.guaranteeText}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {skool.enabled && (
                        <div
                            className={`pricing-card skool-card ${activePlan === 'skool' ? 'active' : 'inactive'}`}
                            onClick={() => setActivePlan('skool')}
                        >
                            <div className="pricing-header">
                                <h3 className="plan-name">{skool.planName}</h3>

                                <div className="price-frame skool-frame">
                                    {skool.oldPrice && (
                                        <div className="old-price-wrapper">
                                            <span className="old-price">{skool.oldPrice}</span>
                                            <div className="strikethrough-line skool-strike"></div>
                                        </div>
                                    )}

                                    <div className="current-price-container">
                                        <span className="current-price skool-price">{skool.currentPrice}</span>
                                        {skool.period && <span className="period">{skool.period}</span>}
                                    </div>
                                </div>

                                <p className="price-subtitle">{skool.subtitle}</p>
                            </div>

                            <div className="pricing-features">
                                {skool.features.map((f, i) => (
                                    <div key={i} className="feature-item">
                                        <Check size={20} className="feature-icon skool-icon" />
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pricing-cta">
                                <a
                                    href={skool.ctaUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-block btn-skool"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {skool.ctaText} <ArrowRight size={20} />
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {visiblePlans.length === 0 && (
                    <p className="empty-pricing">Şu anda aktif bir paket bulunmuyor. Yakında!</p>
                )}
            </div>

            <style>{`
        .pricing-section {
          padding-bottom: 4rem;
        }

        .pricing-wrapper {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
          align-items: stretch;
          perspective: 1000px;
        }

        .empty-pricing {
          text-align: center;
          color: var(--color-text-muted);
          padding: 3rem 0;
        }

        .pricing-card {
          background: linear-gradient(145deg, #1a1a1a, #0f0f0f);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 3rem;
          max-width: 450px;
          width: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .pricing-card.active {
            transform: scale(1.05);
            z-index: 10;
            opacity: 1;
        }

        .main-card.active {
             box-shadow: 0 0 50px rgba(0, 255, 157, 0.2);
             border-color: var(--color-primary);
        }

        .skool-card.active {
             box-shadow: 0 0 50px rgba(255, 51, 51, 0.25);
             border-color: #ff3333;
        }

        .pricing-card.inactive {
            transform: scale(0.95);
            opacity: 0.5;
            filter: grayscale(0.4);
            z-index: 1;
            border-color: var(--color-border-muted, #333);
            box-shadow: none;
        }

        .pricing-card:hover:not(.active) {
            opacity: 0.8;
            transform: scale(0.97);
        }

        .pricing-badge {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--color-primary);
          color: black;
          font-weight: 700;
          padding: 0.5rem 1.5rem;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          box-shadow: 0 5px 15px rgba(0, 255, 157, 0.4);
          transition: transform 0.3s;
          white-space: nowrap;
        }

        .pricing-card.inactive .pricing-badge {
             background: #555;
             box-shadow: none;
             color: #aaa;
        }

        .pricing-header {
          text-align: center;
          margin-bottom: 2.5rem;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-grow: 1;
        }

        .plan-name {
            font-size: 1.5rem;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            transition: color 0.3s;
        }

        .inactive .plan-name {
            color: var(--color-text-muted);
        }

        .price-frame {
            background: linear-gradient(180deg, rgba(0, 255, 157, 0.1) 0%, rgba(0, 0, 0, 0) 100%);
            border: 1px solid rgba(0, 255, 157, 0.3);
            border-radius: var(--radius-lg);
            padding: 2rem 3rem;
            margin: 1.5rem 0;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            box-shadow: 0 0 30px rgba(0, 255, 157, 0.05);
            width: 100%;
            transition: all 0.3s;
        }

        .skool-frame {
            background: linear-gradient(180deg, rgba(255, 51, 51, 0.1) 0%, rgba(0, 0, 0, 0) 100%);
            border-color: rgba(255, 51, 51, 0.3);
            box-shadow: 0 0 30px rgba(255, 51, 51, 0.05);
        }

        .inactive .price-frame {
             background: transparent;
             border-color: #333;
             box-shadow: none;
        }

        .discount-tag {
            position: absolute;
            top: -12px;
            background: #ff4d4d;
            color: white;
            font-size: 0.8rem;
            font-weight: 700;
            padding: 0.2rem 0.8rem;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(255, 77, 77, 0.4);
        }

        .inactive .discount-tag {
            background: #555;
            box-shadow: none;
        }

        .old-price-wrapper {
            position: relative;
            display: inline-block;
            margin-bottom: 0.5rem;
        }

        .old-price {
          color: var(--color-text-muted);
          font-size: 1.5rem;
          font-weight: 500;
          opacity: 0.7;
        }

        .strikethrough-line {
            position: absolute;
            top: 50%;
            left: -10%;
            width: 120%;
            height: 2px;
            background-color: #ff4d4d;
            transform: rotate(-5deg);
            box-shadow: 0 0 5px rgba(255, 77, 77, 0.5);
        }

        .skool-strike {
             background-color: #ffffff;
             opacity: 0.5;
        }

        .inactive .strikethrough-line {
            background-color: #777;
            box-shadow: none;
        }

        .current-price-container {
            display: flex;
            align-items: baseline;
            justify-content: center;
            gap: 0.5rem;
        }

        .current-price {
            font-size: 3.5rem;
            font-weight: 800;
            color: var(--color-text);
            line-height: 1;
            letter-spacing: -2px;
            text-shadow: 0 0 30px rgba(0, 255, 157, 0.3);
            background: linear-gradient(to bottom, #ffffff, #00ff9d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .skool-price {
            background: linear-gradient(to bottom, #ffffff, #ff3333);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 30px rgba(255, 51, 51, 0.3);
        }

        .inactive .current-price {
             background: #888;
             -webkit-background-clip: text;
             -webkit-text-fill-color: transparent;
             text-shadow: none;
        }

        .period {
            color: var(--color-text-muted);
            font-size: 1.2rem;
            font-weight: 500;
        }

        .price-subtitle {
            margin-top: 1rem;
            font-size: 0.9rem;
            color: var(--color-text-muted);
        }

        .pricing-features {
          margin-bottom: 2.5rem;
          width: 100%;
          text-align: left;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .feature-icon {
          color: var(--color-primary);
          flex-shrink: 0;
        }

        .skool-icon {
            color: #ff3333;
        }

        .inactive .feature-icon {
            color: #555;
        }

        .btn-block {
          width: 100%;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-skool {
            background: linear-gradient(135deg, #ff4d4d 0%, #cc0000 100%);
            color: white;
            font-weight: 700;
            padding: 1rem;
            border-radius: var(--radius-md);
            transition: all 0.3s ease;
            box-shadow: 0 0 20px rgba(255, 77, 77, 0.4);
            border: 1px solid rgba(255, 77, 77, 0.5);
        }

        .btn-skool:hover {
            background: linear-gradient(135deg, #ff4d4d 20%, #cc0000 100%);
            box-shadow: 0 0 35px rgba(255, 77, 77, 0.6);
            transform: translateY(-2px);
            border-color: #ff4d4d;
        }

        .inactive .btn {
            background-color: #333;
            color: #777;
            pointer-events: none;
            box-shadow: none;
        }

        .guarantee-text {
          text-align: center;
          font-size: 0.9rem;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
            .pricing-wrapper {
                flex-direction: column;
                align-items: center;
                gap: 1.5rem;
            }

            .pricing-card {
                max-width: 100%;
                padding: 1.5rem 1rem;
            }

            .pricing-header {
                margin-bottom: 1rem;
                padding-bottom: 1rem;
            }

            .pricing-badge {
                font-size: 0.75rem;
                padding: 0.4rem 1rem;
                width: max-content;
            }

            .plan-name {
                font-size: 1.25rem;
            }

            .price-frame {
                 padding: 1.5rem 1rem;
            }

            .current-price {
                font-size: 2.2rem;
            }

            .old-price {
                font-size: 1.2rem;
            }

            .feature-item {
                font-size: 1rem;
            }

            .pricing-card.active {
                transform: none;
                border-color: var(--color-primary);
                box-shadow: 0 0 15px rgba(0, 255, 157, 0.1);
            }

            .skool-card.active {
                border-color: #ff3333;
                box-shadow: 0 0 15px rgba(255, 51, 51, 0.15);
            }

            .pricing-card.inactive {
                transform: none;
                opacity: 1;
                filter: none;
                border-color: var(--color-border);
            }
        }
      `}</style>
        </section>
    );
};
