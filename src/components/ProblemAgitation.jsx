import React from 'react';
import { Bot, Globe, Wallet } from 'lucide-react';

export const ProblemAgitation = () => {
  const problems = [
    {
      icon: <Bot size={32} className="text-red-500" />,
      title: "Yapay Zekâ Survivor'ı",
      description: "Yapay zekâ ile yeni projelere giriş kolaylaştı. Herkes benzer ürünü hızlıca üretirken farklılaşan 'Reklamı' iyi yapan olacak!"
    },
    {
      icon: <Globe size={32} className="text-red-500" />,
      title: "Zaman & Konum Özgürlüğü",
      description: "İnternette saatlerce 'nasıl para kazanılır' videoları izleyip, hiçbir sonuç alamamaktan bıktınız mı?"
    },
    {
      icon: <Wallet size={32} className="text-red-500" />,
      title: "Kazanç Belirleme Özgürlüğü",
      description: "Freelance çalışan bir editör, gelirini ve çalışma süresini kendi isteği ve performansına göre belirleyebilir!"
    },
  ];

  return (
    <section className="section problem-section">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">
            Neden <span className="text-gradient-danger">İçerik Üretimi</span> Yarın Devam Edecek?
          </h2>
          <p className="section-subtitle">
            Belki de bugüne kadar size yanlış şeyler öğretildi. Sorun sizde değil, yönteminizde.
          </p>
        </div>

        <div className="problems-grid">
          {problems.map((problem, index) => (
            <div key={index} className="problem-card">
              <div className="problem-icon-wrapper">
                {problem.icon}
              </div>
              <h3 className="problem-title">{problem.title}</h3>
              <p className="problem-desc">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .problem-section {
          /* background-color: var(--color-surface); Removed for panel style */
        }

        .text-gradient-danger {
          background: linear-gradient(to right, #ff4d4d, #ff9e9e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .section-header {
          margin-bottom: 4rem;
          text-align: center;
        }

        .section-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: var(--color-text-muted);
          max-width: 600px;
          margin: 0 auto;
        }

        .problems-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .problem-card {
          background: var(--color-bg);
          padding: 2rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          transition: transform 0.3s ease;
        }

        .problem-card:hover {
          transform: translateY(-5px);
          border-color: #ff4d4d;
        }

        .problem-icon-wrapper {
          margin-bottom: 1.5rem;
          color: #ff4d4d;
        }

        .problem-title {
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }

        .problem-desc {
          color: var(--color-text-muted);
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
          }
          
          .problems-grid {
             grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
