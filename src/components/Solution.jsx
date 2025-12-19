import React from 'react';
import { CheckCircle, Star, Zap, Award } from 'lucide-react';

export const Solution = () => {
  const benefits = [
    "Sıfırdan İleri Seviyeye Kurgu Mantığı",
    "Premiere Pro Ustalığı",
    "Viral Video Sırları ve Algoritma",
    "Müşteri Bulma ve Pazarlama Stratejileri",
    "Yapay Zeka ile Hızlandırılmış İş Akışı",
    "Ömür Boyu Erişim ve Güncellemeler"
  ];

  return (
    <section className="section solution-section">
      <div className="container">
        <div className="solution-content">
          <div className="solution-text">
            <div className="badge-success">
              <Star size={16} fill="currentColor" /> Çözüm Burada
            </div>
            <h2 className="section-title">
              Video Editörlüğü: <br />
              <span className="text-gradient-primary">Özgürlüğünüzün Anahtarı</span>
            </h2>
            <p className="solution-desc">
              Artık karmaşık tekniklerle boğuşmanıza gerek yok. Hazırladığım bu kapsamlı eğitim seti ile
              sadece birkaç hafta içinde profesyonel bir video editörü olabilir ve dolarla kazanmaya başlayabilirsiniz.
            </p>

            <ul className="benefits-list">
              {benefits.map((benefit, index) => (
                <li key={index} className="benefit-item">
                  <CheckCircle className="benefit-icon" size={24} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="solution-stats">
              <div className="stat-item">
                <Zap size={32} className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-value">7+ Saat</span>
                  <span className="stat-label">Dolu Dolu İçerik</span>
                </div>
              </div>
            </div>
          </div>

          <div className="solution-visual">
            <div className="course-card-stack">
              <div className="card-layer layer-1"></div>
              <div className="card-layer layer-2"></div>
              <div className="card-main">
                <div className="card-header">
                  <span className="course-tag">PREMIUM KURS</span>
                  <h3>Video Editörlüğü Ustalık Sınıfı</h3>
                </div>
                <div className="card-body">
                  <div className="module-preview">
                    <div className="module-line"></div>
                    <div className="module-line short"></div>
                    <div className="module-line"></div>
                  </div>
                  <div className="instructor-info">
                    <div className="instructor-avatar"></div>
                    <div>
                      <p className="instructor-name">Furkan Güneş</p>
                      <p className="instructor-title">Expert Editor</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .solution-section {
          /* background-color: var(--color-bg); Removed for panel style */
        }

        .solution-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .badge-success {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-primary);
          font-weight: 600;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.8rem;
        }

        .solution-desc {
          color: var(--color-text-muted);
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        .benefits-list {
          list-style: none;
          margin-bottom: 3rem;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .benefit-icon {
          color: var(--color-primary);
          flex-shrink: 0;
        }

        .solution-stats {
          display: flex;
          gap: 3rem;
          padding-top: 2rem;
          border-top: 1px solid var(--color-border);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          color: var(--color-accent);
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--color-text);
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }

        /* Visual Styles */
        .course-card-stack {
          position: relative;
          padding: 2rem;
        }

        .card-main {
          background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 2rem;
          position: relative;
          z-index: 3;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        .card-layer {
          position: absolute;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          width: 100%;
          height: 100%;
        }

        .layer-1 {
          top: 0;
          left: 2rem;
          z-index: 2;
          transform: rotate(3deg);
          opacity: 0.5;
        }

        .layer-2 {
          top: 1rem;
          left: 1rem;
          z-index: 1;
          transform: rotate(-3deg);
          opacity: 0.3;
        }

        .card-header {
          margin-bottom: 2rem;
        }

        .course-tag {
          background: var(--color-primary);
          color: black;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.7rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          display: inline-block;
        }

        .module-preview {
          background: rgba(0,0,0,0.2);
          padding: 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
        }

        .module-line {
          height: 8px;
          background: var(--color-border);
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }

        .module-line.short {
          width: 60%;
        }

        .instructor-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .instructor-avatar {
          width: 48px;
          height: 48px;
          background: var(--color-border);
          border-radius: 50%;
        }

        .instructor-name {
          font-weight: 600;
        }

        .instructor-title {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        @media (max-width: 768px) {
          .solution-content {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .card-layer {
            display: none;
          }
          
          .solution-text {
            text-align: center;
          }
          
          .badge-success {
            justify-content: center;
          }
          
          .solution-stats {
            justify-content: center;
            flex-wrap: wrap;
            gap: 2rem;
          }
          
          .stat-item {
            flex-direction: column;
            text-align: center;
          }
          

          .benefits-list {
            display: flex;
            flex-direction: column;
            align-items: flex-start; /* Align items to the left relative to list container */
            text-align: left;
            width: fit-content; /* Shrink to fit content so margin:auto works */
            margin: 0 auto 3rem auto; /* Center the list block horizontally */
            padding-left: 0; /* Removing default padding if any */
          }
          
          .benefit-item {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 1rem;
            margin-bottom: 1rem;
            font-size: 1.1rem;
            width: fit-content; /* Only take space needed */
          }
          

          /* Aggressive Mobile Fix for Card Overflow */
          .course-card-stack {
            padding: 0;
            margin-top: 1rem;
            width: auto;
            max-width: 280px; /* Safe pixel width for all mobile screens */
            margin-left: auto;
            margin-right: auto;
            transform: none;
          }

          .card-main {
            padding: 1rem 0.8rem; /* Minimize horizontal padding */
          }

          .card-header h3 {
            font-size: 0.95rem; /* Reduce font size slightly more */
            white-space: normal;
            line-height: 1.3;
          }
          
          .module-preview {
             padding: 0.75rem;
          }
        }
      `}</style>
    </section>
  );
};
