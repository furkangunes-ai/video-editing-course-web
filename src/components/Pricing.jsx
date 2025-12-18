import React, { useState } from 'react';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';

export const Pricing = () => {
    const [activePlan, setActivePlan] = useState('pro');

    return (
        <section className="section pricing-section">
            <div className="container">
                <div className="pricing-wrapper">
                    {/* Existing Main Card */}
                    <div
                        className={`pricing-card main-card ${activePlan === 'pro' ? 'active' : 'inactive'}`}
                        onClick={() => setActivePlan('pro')}
                    >
                        <div className="pricing-header">
                            <div className="pricing-badge">SINIRLI SÜRE İÇİN</div>
                            <h3 className="plan-name">Video Editörlüğü Ustalık Sınıfı</h3>

                            <div className="price-frame">
                                <div className="discount-tag">
                                    %80 İNDİRİM
                                </div>
                                <div className="old-price-wrapper">
                                    <span className="old-price">5.000 TL</span>
                                    <div className="strikethrough-line"></div>
                                </div>

                                <div className="current-price-container">
                                    <span className="current-price">999 TL</span>
                                </div>
                            </div>

                            <p className="price-subtitle">Tek seferlik ödeme. Ömür boyu erişim.</p>
                        </div>

                        <div className="pricing-features">
                            <div className="feature-item">
                                <Check size={20} className="feature-icon" />
                                <span>Tüm Eğitim Modülleri (7+ Saat)</span>
                            </div>
                            <div className="feature-item">
                                <Check size={20} className="feature-icon" />
                                <span>Premiere Pro Eğitimi</span>
                            </div>
                            <div className="feature-item">
                                <Check size={20} className="feature-icon" />
                                <span>Müşteri Bulma Rehberi (Bonus)</span>
                            </div>
                            <div className="feature-item">
                                <Check size={20} className="feature-icon" />
                                <span>Özel WhatsApp Destek Grubu</span>
                            </div>

                        </div>

                        <div className="pricing-cta">
                            <a
                                href="https://wa.me/905011411940"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary btn-block"
                            >
                                Hemen İndirimli Kaydol <ArrowRight size={20} />
                            </a>
                            <p className="guarantee-text">
                                <ShieldCheck size={16} className="inline-icon" />
                                30 Gün Para İade Garantisi
                            </p>
                        </div>
                    </div>

                    {/* New Skool Card */}
                    <div
                        className={`pricing-card skool-card ${activePlan === 'skool' ? 'active' : 'inactive'}`}
                        onClick={() => setActivePlan('skool')}
                    >
                        <div className="pricing-header">
                            <h3 className="plan-name">Skool Topluluk & Abonelik</h3>

                            <div className="price-frame skool-frame">
                                <div className="old-price-wrapper">
                                    <span className="old-price">$12</span>
                                    <div className="strikethrough-line skool-strike"></div>
                                </div>

                                <div className="current-price-container">
                                    <span className="current-price skool-price">$5</span>
                                    <span className="period">/ Ay</span>
                                </div>
                            </div>

                            <p className="price-subtitle">Aylık Abonelik. İstediğin zaman iptal et.</p>
                        </div>

                        <div className="pricing-features">
                            <div className="feature-item">
                                <Check size={20} className="feature-icon skool-icon" />
                                <span>Tüm Eğitim Modülleri (Mevcut + Gelecek)</span>
                            </div>
                            <div className="feature-item">
                                <Check size={20} className="feature-icon skool-icon" />
                                <span>Skool Topluluk Erişimi</span>
                            </div>
                            <div className="feature-item">
                                <Check size={20} className="feature-icon skool-icon" />
                                <span>Sürekli Güncel İçerik</span>
                            </div>
                            <div className="feature-item">
                                <Check size={20} className="feature-icon skool-icon" />
                                <span>Aylık Canlı Yayınlar</span>
                            </div>
                        </div>

                        <div className="pricing-cta">
                            <a
                                href="#"
                                className="btn btn-block btn-skool"
                            >
                                Skool ile Abone Ol <ArrowRight size={20} />
                            </a>
                        </div>
                    </div>
                </div>
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
          perspective: 1000px; /* For potential 3D effects */
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
        
        /* Main Card Specifics */
        .main-card {
             /* Default border before active state handles it */
        }

        /* Skool Card Specifics */
        .skool-card {
             /* Default border before active state handles it */
        }
        
        /* Interactive States */
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
            pointer-events: none; /* Prevent clicking button on inactive card? Maybe allow but just dim it */
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
            }
            
            .pricing-card {
                max-width: 100%;
            }
            
            /* In mobile, maybe less scale difference to avoid layout shift issues? */
            .pricing-card.active {
                transform: scale(1.02);
            }
            .pricing-card.inactive {
                transform: scale(0.98);
            }
        }
      `}</style>
        </section>
    );
};
