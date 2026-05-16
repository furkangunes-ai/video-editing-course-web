import React, { useState } from 'react';
import { Instagram, Youtube, Mail, MessageCircle, Settings } from 'lucide-react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { LegalModal } from './LegalModal';

export const Footer = () => {
    const config = useSiteConfig();
    const [openDoc, setOpenDoc] = useState(null);
    const whatsappUrl = `https://wa.me/${config.contact.whatsapp}`;
    const instagramUrl = `https://www.instagram.com/${config.contact.instagram}/`;
    const mailtoUrl = `mailto:${config.contact.email}`;

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3 className="footer-logo">
                            {config.brand.name}
                            {config.brand.tagline && <span className="footer-tag"> {config.brand.tagline}</span>}
                        </h3>
                        <p className="footer-desc">
                            Video kurgu sanatını öğrenin, gelirinizi artırın ve özgürlüğünüze kavuşun.
                        </p>
                    </div>

                    <div className="footer-links">
                        <h4>Hızlı Bağlantılar</h4>
                        <button type="button" onClick={() => scrollTo('products')}>Eğitim İçeriği</button>
                        <button type="button" onClick={() => scrollTo('instructor')}>Ben Kimim</button>
                        <button type="button" onClick={() => scrollTo('contact')}>İletişim</button>
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                    </div>

                    <div className="footer-links">
                        <h4>Yasal</h4>
                        <button type="button" onClick={() => setOpenDoc('kvkk')}>KVKK Aydınlatma Metni</button>
                        <button type="button" onClick={() => setOpenDoc('mesafeli')}>Mesafeli Satış Sözleşmesi</button>
                        <button type="button" onClick={() => setOpenDoc('iade')}>İade ve İptal Koşulları</button>
                    </div>

                    <div className="footer-social">
                        <h4>Bizi Takip Edin</h4>
                        <div className="social-icons">
                            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                                <Instagram size={22} />
                            </a>
                            <a href={mailtoUrl} className="social-icon" aria-label="E-posta">
                                <Mail size={22} />
                            </a>
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="WhatsApp">
                                <MessageCircle size={22} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {config.brand.copyrightYear} {config.brand.name}. Tüm hakları saklıdır.</p>
                    <a href="#admin" className="admin-link" title="Yönetim paneli">
                        <Settings size={14} />
                        <span>Yönetim</span>
                    </a>
                </div>
            </div>

            <LegalModal doc={openDoc} onClose={() => setOpenDoc(null)} />

            <style>{`
        .footer {
          background-color: #050505;
          padding: 4rem 0 2rem;
          border-top: 1px solid var(--color-border);
        }

        .footer-content {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .footer-logo {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          background: linear-gradient(to right, var(--color-primary), var(--color-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .footer-tag {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--color-text-muted);
          -webkit-text-fill-color: var(--color-text-muted);
          background: none;
        }

        .footer-desc {
          color: var(--color-text-muted);
          max-width: 300px;
        }

        .footer-links, .footer-social {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-links h4, .footer-social h4 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .footer-links a,
        .footer-links button {
          color: var(--color-text-muted);
          transition: color 0.2s;
          text-align: left;
          padding: 0;
          font-size: 0.95rem;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        .footer-links a:hover,
        .footer-links button:hover {
          color: var(--color-primary);
        }

        .social-icons {
          display: flex;
          gap: 0.75rem;
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
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--color-text-muted);
          font-size: 0.9rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .admin-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: var(--color-text-muted);
          opacity: 0.5;
          transition: opacity 0.2s, color 0.2s;
        }

        .admin-link:hover {
          opacity: 1;
          color: var(--color-primary);
        }

        @media (max-width: 900px) {
          .footer-content {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
            text-align: left;
          }
        }

        @media (max-width: 600px) {
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

          .footer-links a,
          .footer-links button {
            text-align: center;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
        </footer>
    );
};
