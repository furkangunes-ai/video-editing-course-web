import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export const FAQ = () => {
  const faqs = [
    {
      question: "Daha önce hiç video kurgusu yapmadım, bu kurs bana uygun mu?",
      answer: "Kesinlikle! Kursumuz sıfırdan başlayanlar için tasarlandı. Temel kavramlardan başlayıp ileri seviye tekniklere kadar adım adım ilerliyoruz."
    },
    {
      question: "Hangi programları kullanacağız? Ücretli mi?",
      answer: "Premiere Pro ile ilerleyeceğiz, bu program ücretlidir ve kurs ücretine dahil değildir."
    },
    {
      question: "Kursu bitirince hemen para kazanabilir miyim?",
      answer: "Kazanma garantisi hiçbir işin yoktur, ancak bu donanımları edindikten sonra para kazanamayan arkadaşın sorgulaması gereken daha önemli meseleler olduğu açıktır."
    },
    {
      question: "Eğitime ne kadar süre erişebileceğim?",
      answer: "Ömür boyu! Ancak kullanılan platform burada belirleyicidir. Eğer skool platformu kullanacak olursanız ileride eklenen kurslara erişim elde edersiniz fakat aylık ödeme gerekir. Tabii bu kurslardan herhangi birini 1 ay içerisinde bitirecek kişinin skool ile daha ucuza sorunu çözmesi mümkündür."
    },
    {
      question: "Memnun kalmazsam iade edebilir miyim?",
      answer: "Parçalı bir geri ödeme hakkınız vardır. İlk bir hafta içerisinde %70'lik, kalan süreçte ise ilk bir ayda %40'lık parçalı iade hakkına sahipsiniz. Bu skool platformu için dahil değildir."
    }
  ];

  return (
    <section className="section faq-section">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">Aklınızda Soru Kalmasın</h2>
          <p className="section-subtitle">Sıkça sorulan soruları sizin için yanıtladık.</p>
        </div>

        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} />
          ))}
        </div>
      </div>

      <style>{`
        .faq-section {
          /* background-color: var(--color-surface); Removed for panel style */
        }

        .faq-grid {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
      `}</style>
    </section>
  );
};

const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item" onClick={() => setIsOpen(!isOpen)}>
      <div className="faq-question">
        <span>{faq.question}</span>
        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
      </div>
      <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
        <p>{faq.answer}</p>
      </div>

      <style>{`
        .faq-item {
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .faq-item:hover {
          border-color: var(--color-text-muted);
        }

        .faq-question {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, padding 0.3s ease;
          padding: 0 1.5rem;
          color: var(--color-text-muted);
        }

        .faq-answer.open {
          max-height: 200px;
          padding-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
};
