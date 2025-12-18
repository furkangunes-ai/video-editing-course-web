import React from 'react';
import { Mail, MessageCircle, Instagram } from 'lucide-react';

export const Contact = () => {
  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="contact-wrapper">
          <div className="section-header text-center">
            <h2 className="section-title">İletişime Geçin</h2>
            <p className="section-subtitle">
              Aklınıza takılan bir şey mi var? Bize ulaşmaktan çekinmeyin.
            </p>
          </div>

          <div className="contact-cards">
            <a href="mailto:admin@furkangunes.co" className="contact-card">
              <div className="icon-box">
                <Mail size={32} />
              </div>
              <h3>E-posta Gönder</h3>
              <p>admin@furkangunes.co</p>
            </a>

            <a href="https://wa.me/905011411940" target="_blank" rel="noopener noreferrer" className="contact-card highlight">
              <div className="icon-box">
                <MessageCircle size={32} />
              </div>
              <h3>WhatsApp</h3>
              <p>+90 501 141 19 40</p>
            </a>

            <a href="https://www.instagram.com/furkangunes.3/" className="contact-card">
              <div className="icon-box">
                <Instagram size={32} />
              </div>
              <h3>Instagram</h3>
              <p>@furkangunes.3</p>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .contact-section {
          /* background-color: var(--color-surface); Removed for panel style */
          padding: 2rem 0;
        }

        .contact-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .contact-card {
          background: var(--color-bg);
          padding: 2rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          text-align: center;
          transition: transform 0.3s ease, border-color 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .contact-card:hover {
          transform: translateY(-5px);
          border-color: var(--color-primary);
        }

        .contact-card.highlight {
          border-color: var(--color-primary);
          box-shadow: 0 0 20px rgba(0, 255, 157, 0.1);
        }

        .icon-box {
          width: 64px;
          height: 64px;
          background: var(--color-surface);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
          margin-bottom: 0.5rem;
        }

        .contact-card h3 {
          font-size: 1.2rem;
          margin: 0;
        }

        .contact-card p {
          color: var(--color-text-muted);
          margin: 0;
        }
      `}</style>
    </section>
  );
};
