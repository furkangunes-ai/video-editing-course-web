import React from 'react';
import { CheckCircle, Award, Users, Star, Video } from 'lucide-react';
import { ParticleSwap } from './ParticleSwap';
import furkanImage from '../assets/furkan-gunes.jpg';

export const Instructor = () => {
  return (
    <section id="instructor" className="instructor-section">
      <div className="instructor-content">
        <div className="instructor-image-wrapper">
          <div className="image-frame">
            <img
              src={furkanImage}
              alt="Furkan Güneş"
              className="instructor-img"
            />
          </div>
          <div className="experience-badge">
            <span className="years">5+</span>
            <span className="label">Yıl Deneyim</span>
          </div>
        </div>

        <div className="instructor-info">
          <div className="instructor-header">
            <h2 className="section-title">
              <span className="title-prefix">Eğitmeniniz:</span> <br />
              <ParticleSwap
                text="Furkan Güneş"
                hiddenText="Değerli Dostunuz"
              />
            </h2>
            <h3 className="instructor-role">Profesyonel Video Editörü & İçerik Üreticisi</h3>
          </div>

          <div className="instructor-bio-container">
            <p className="instructor-bio">
              Merhaba! Ben Furkan. Sadece bir video editörü değilim.
              Gazi Makine Mühendisliğini bırakan, 100.000'lerce abonesi olan yabancı kanallara içerik üreten,
              kendi hesabında on milyonlarca izleyiciye ulaşan çok yönlü bir dostunuzum.
              Size editörlüğü değil, bu işten para kazanmayı öğretmek için buradayım.
            </p>
          </div>

          <div className="achievements">
            <div className="achievement-item">
              <Video size={24} className="achievement-icon" />
              <span>2000+ Video Kurgusu</span>
            </div>
            <div className="achievement-item">
              <Users size={24} className="achievement-icon" />
              <span>30.000.000+ İzleyici</span>
            </div>
            <div className="achievement-item">
              <Award size={24} className="achievement-icon" />
              <span>Nöropazarlama Metotları!</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .instructor-section {
          width: 100%;
        }

        .instructor-content {
          display: flex;
          flex-direction: row;
          gap: 5rem;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }

        .instructor-image-wrapper {
          position: relative;
          width: 100%;
          max-width: 350px;
          flex: 0 0 350px;
        }

        .instructor-info {
          flex: 1;
          min-width: 300px;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .instructor-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .section-title {
          font-size: 3.5rem;
          line-height: 1.1;
          display: block;
          margin: 0;
          letter-spacing: -0.02em;
        }
        
        .title-prefix {
          font-size: 1.5rem;
          font-weight: 400;
          color: var(--color-text-muted);
          display: block;
          margin-bottom: 0.5rem;
        }

        .instructor-role {
          font-size: 1.25rem;
          color: var(--color-primary);
          font-weight: 500;
          margin: 0;
          opacity: 0.9;
        }

        .instructor-bio-container {
          max-width: 650px;
          border-left: 2px solid var(--color-border);
          padding-left: 1.5rem;
        }

        .instructor-bio {
          color: var(--color-text-muted);
          font-size: 1.15rem;
          line-height: 1.7;
          margin: 0;
        }

        .image-frame {
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 2px solid var(--color-primary);
          box-shadow: 20px 20px 0 rgba(0, 255, 157, 0.1);
          position: relative;
          z-index: 1;
        }

        .instructor-img {
          width: 100%;
          height: auto;
          display: block;
          filter: grayscale(20%);
          transition: filter 0.3s;
        }

        .instructor-img:hover {
          filter: grayscale(0%);
        }

        .experience-badge {
          position: absolute;
          bottom: -20px;
          right: -20px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          padding: 1rem 1.5rem;
          border-radius: var(--radius-md);
          text-align: center;
          z-index: 2;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .years {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-primary);
          line-height: 1;
        }

        .label {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        .achievements {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.5rem;
          width: 100%;
        }

        .achievement-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.03);
          padding: 1.2rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          transition: transform 0.2s;
        }
        
        .achievement-item:hover {
          transform: translateY(-2px);
          border-color: var(--color-primary);
        }

        .achievement-icon {
          color: var(--color-primary);
        }

        @media (max-width: 900px) {
          .instructor-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 3rem;
          }

          .instructor-image-wrapper {
            flex: 0 0 auto;
            max-width: 100%;
          }

          .instructor-info {
            width: 100%;
            align-items: center;
            gap: 2rem;
          }
          
          .instructor-bio-container {
            border-left: none;
            padding-left: 0;
            margin: 0 auto;
          }

          .achievements {
            justify-content: center;
          }
          
          .achievement-item {
            justify-content: center;
          }
          
          .experience-badge {
            right: 0;
            left: 0;
            margin: 0 auto;
            width: max-content;
            bottom: -25px;
          }
        }
      `}</style>
    </section>
  );
};
