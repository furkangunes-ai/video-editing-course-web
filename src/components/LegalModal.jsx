import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const KVKK = `KİŞİSEL VERİLERİN KORUNMASI (KVKK) AYDINLATMA METNİ

Veri Sorumlusu: Furkan Güneş

1. Toplanan Kişisel Veriler
Sitemizi ziyaret ettiğinizde ve hizmetlerimizden faydalandığınızda; ad-soyad, e-posta, telefon, IP adresi, çerez verileri, satın alma kayıtları toplanabilir.

2. Verilerin İşlenme Amacı
- Eğitim hizmetinin sunulması ve müşteri ilişkilerinin yürütülmesi
- Yasal yükümlülüklerin yerine getirilmesi (faturalama, vergisel kayıtlar)
- Pazarlama, reklam ve ölçüm çalışmaları (açık rıza ile)
- Site performansı ve güvenlik analizleri

3. Aktarım
Veriler; ödeme altyapısı sağlayıcıları, barındırma sağlayıcıları, e-posta servisleri, analiz araçları (Microsoft Clarity) ile yasal zorunluluklar çerçevesinde paylaşılabilir.

4. Haklarınız
KVKK m.11 kapsamında verilerinize erişme, düzeltme, silme ve işlenmesine itiraz etme haklarına sahipsiniz.

5. Saklama Süresi
Yasal saklama süreleri sona erdikten sonra veriler silinir/anonimleştirilir.

NOT: Bu metin örnek bir taslaktır. Yayına almadan önce bir hukuk danışmanı ile gözden geçirilmesi tavsiye edilir.`;

const MESAFELI = `MESAFELİ SATIŞ SÖZLEŞMESİ

SATICI: Furkan Güneş

ALICI: Sipariş sırasında verilen bilgilerdeki kişi.

1. KONU
İşbu sözleşmenin konusu, Alıcı'nın Satıcı'ya ait internet sitesi üzerinden elektronik ortamda sipariş verdiği, dijital eğitim hizmetinin satışı ve teslimine ilişkin tarafların hak ve yükümlülüklerinin saptanmasıdır.

2. ÜRÜN/HİZMET
- Hizmet: Video Editörlüğü Online Eğitim
- Teslim Şekli: Dijital erişim. Ödemenin onaylanmasının ardından kullanıcıya eğitim platformuna erişim sağlanır.

3. ÖDEME
Ödeme; banka/kredi kartı veya havale yöntemleriyle alınır. Üçüncü taraf ödeme altyapısı güvenli ödeme sayfası üzerinden gerçekleşir.

4. CAYMA HAKKI
Mesafeli Sözleşmeler Yönetmeliği m.15/(ğ) gereği, "elektronik ortamda anında ifa edilen hizmetler ile tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmelerde" cayma hakkı kullanılamaz. Ancak Satıcı, ticari iyi niyet kapsamında parçalı iade hakkı tanımaktadır.

5. UYUŞMAZLIKLARIN ÇÖZÜMÜ
Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.

NOT: Bu metin örnek bir taslaktır. Yayına almadan önce bir hukuk danışmanı ile gözden geçirilmesi tavsiye edilir.`;

const IADE = `İADE VE İPTAL KOŞULLARI

1. Dijital Erişim Hakkı
Satın alma anında eğitim platformuna erişim aktive edilir. Mesafeli Sözleşmeler Yönetmeliği m.15/(ğ) uyarınca dijital içeriklerde cayma hakkı kanunen yoktur.

2. Memnuniyet Garantisi (Ticari İyi Niyet)
İlk hafta %70, ilk ay %40 parçalı iade hakkı:
- İlk 7 gün içinde talep edilmesi halinde ödemenin %70'i iade edilir.
- 7 ile 30 gün arası talep edilmesi halinde ödemenin %40'ı iade edilir.
- 30 günden sonra iade hakkı sona erer.

3. Abonelik İptali
Abonelik bazlı paketler kullanıcı paneli üzerinden tek tıkla iptal edilebilir. İptal sonrası dönem sonuna kadar erişim devam eder.

4. Talep Yöntemi
İade talepleri WhatsApp veya e-posta üzerinden, satın alma sırasında kullanılan e-posta ile iletilmelidir.

5. İade Süresi
Onaylanan iade talepleri 14 iş günü içinde, ödeme alınan yönteme yapılır.

NOT: Bu metin örnek bir taslaktır. Yayına almadan önce bir hukuk danışmanı ile gözden geçirilmesi tavsiye edilir.`;

const DOCS = {
  kvkk: { title: 'KVKK Aydınlatma Metni', body: KVKK },
  mesafeli: { title: 'Mesafeli Satış Sözleşmesi', body: MESAFELI },
  iade: { title: 'İade ve İptal Koşulları', body: IADE },
};

export const LegalModal = ({ doc, onClose }) => {
  useEffect(() => {
    if (!doc) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [doc, onClose]);

  if (!doc || !DOCS[doc]) return null;
  const { title, body } = DOCS[doc];

  return (
    <div className="legal-overlay" onClick={onClose}>
      <div className="legal-content" onClick={(e) => e.stopPropagation()}>
        <div className="legal-header">
          <h2>{title}</h2>
          <button className="legal-close" onClick={onClose} aria-label="Kapat">
            <X size={22} />
          </button>
        </div>
        <pre className="legal-body">{body}</pre>
      </div>

      <style>{`
        .legal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .legal-content {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          max-width: 800px;
          width: 100%;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
        }

        .legal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--color-border);
        }

        .legal-header h2 {
          font-size: 1.3rem;
          margin: 0;
        }

        .legal-close {
          color: var(--color-text-muted);
          padding: 0.4rem;
          border-radius: 50%;
          transition: background 0.2s, color 0.2s;
        }

        .legal-close:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-text);
        }

        .legal-body {
          padding: 2rem;
          overflow-y: auto;
          color: var(--color-text-muted);
          font-family: var(--font-sans);
          font-size: 0.95rem;
          line-height: 1.7;
          white-space: pre-wrap;
          word-wrap: break-word;
          margin: 0;
        }

        @media (max-width: 768px) {
          .legal-overlay { padding: 1rem; }
          .legal-header { padding: 1rem 1.5rem; }
          .legal-body { padding: 1.5rem; font-size: 0.9rem; }
        }
      `}</style>
    </div>
  );
};
