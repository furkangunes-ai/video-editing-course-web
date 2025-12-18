import React from 'react';
import { Instagram, Youtube, Twitter } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3 className="footer-logo">VideoMaster</h3>
                        <p className="footer-desc">
                            Video kurgu sanatını öğrenin, gelirinizi artırın ve özgürlüğünüze kavuşun.
                        </p>
                    </div>

                    <div className="footer-links">
                        <h4>Hızlı Bağlantılar</h4>
                        <a href="#">Eğitim İçeriği</a>
                        <a href="#">Öğrenci Yorumları</a>
                        <a href="#">Sıkça Sorulanlar</a>
                        <a href="#">İletişim</a>
                    </div>

                    <div className="footer-social">
                        <h4>Bizi Takip Edin</h4>
                        <div className="social-icons">
                            <a href="#" className="social-icon"><Instagram size={24} /></a>
                            <a href="#" className="social-icon"><Youtube size={24} /></a>
                            <a href="#" className="social-icon"><Twitter size={24} /></a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 VideoMaster. Tüm hakları saklıdır.</p>
                </div>
            </div>

            <style>{`
        .footer {
          background-color: #050505;
          padding: 4rem 0 2rem;
          border-top: 1px solid var(--color-border);
        }

        .footer-content {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 4rem;
          margin-bottom: 4rem;
        }

        .footer-logo {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          background: linear-gradient(to right, var(--color-primary), var(--color-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .footer-desc {
          color: var(--color-text-muted);
          max-width: 300px;
        }

        .footer-links, .footer-social {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-links h4, .footer-social h4 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }

        .footer-links a {
          color: var(--color-text-muted);
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: var(--color-primary);
        }

        .social-icons {
          display: flex;
          gap: 1rem;
        }

        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--color-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text);
          transition: all 0.2s;
        }

        .social-icon:hover {
          background: var(--color-primary);
          color: black;
          transform: translateY(-3px);
        }

        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .footer-desc {
            margin: 0 auto;
          }

          .social-icons {
            justify-content: center;
          }
        }
      `}</style>
        </footer>
    );
};
