import React from 'react';
import { Star, User } from 'lucide-react';

export const SocialProof = () => {
  const testimonials = [
    {
      name: "Ahmet Y.",
      role: "Freelance Editör",
      content: "Bu kursa başlamadan önce ayda 3-4 bin TL zor kazanıyordum. Şimdi sadece bir müşteriden bu parayı alıyorum. Kesinlikle tavsiye ederim.",
      rating: 5
    },
    {
      name: "Zeynep K.",
      role: "İçerik Üreticisi",
      content: "Kurgu yapmayı gözümde çok büyütüyordum. Furkan hoca o kadar basit anlattı ki, ilk haftada kendi YouTube kanalımı açtım.",
      rating: 5
    },
    {
      name: "Mehmet S.",
      role: "Öğrenci",
      content: "Harçlığımı çıkarmak için başladım, şimdi babamdan daha çok kazanıyorum. Şaka gibi ama gerçek.",
      rating: 5
    }
  ];

  return (
    <section className="section social-proof-section">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">
            Sadece Biz Söylemiyoruz... <br />
            <span className="text-gradient-primary">Öğrencilerimiz Ne Diyor?</span>
          </h2>
          <p className="section-subtitle">
            Yüzlerce öğrencimiz hayatını değiştirdi. Sıra sizde.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-header">
                <div className="avatar-placeholder">
                  <User size={24} />
                </div>
                <div className="user-info">
                  <h4 className="user-name">{testimonial.name}</h4>
                  <span className="user-role">{testimonial.role}</span>
                </div>
              </div>
              <div className="stars">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#ffd700" color="#ffd700" />
                ))}
              </div>
              <p className="testimonial-content">"{testimonial.content}"</p>
            </div>
          ))}
        </div>

        <div className="stats-banner">
          <div className="stat-box">
            <span className="stat-number">500+</span>
            <span className="stat-desc">Mutlu Öğrenci</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <span className="stat-number">4.9/5</span>
            <span className="stat-desc">Ortalama Puan</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <span className="stat-number">%95</span>
            <span className="stat-desc">Başarı Oranı</span>
          </div>
        </div>
      </div>

      <style>{`
        .social-proof-section {
          /* background-color: var(--color-surface); Removed for panel style */
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .testimonial-card {
          background: var(--color-bg);
          padding: 2rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
        }

        .testimonial-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .avatar-placeholder {
          width: 48px;
          height: 48px;
          background: var(--color-surface-hover);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
        }

        .user-name {
          font-weight: 600;
        }

        .user-role {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .stars {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }

        .testimonial-content {
          font-style: italic;
          color: var(--color-text-muted);
        }

        .stats-banner {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          flex-wrap: wrap;
        }

        .stat-box {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-primary);
        }

        .stat-desc {
          color: var(--color-text-muted);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-divider {
          width: 1px;
          height: 50px;
          background: var(--color-border);
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 1.75rem;
            line-height: 1.2;
          }

          .stat-divider {
            display: none;
          }
          
          .stats-banner {
            flex-direction: column;
            gap: 2rem;
          }
          
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
