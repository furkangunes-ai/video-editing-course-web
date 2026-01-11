import { Link } from 'react-router-dom';
import { useState } from 'react';

const API_BASE_URL = 'https://videomaster-backend-production.up.railway.app';

export function AdminHub() {
  const [courseCreating, setCourseCreating] = useState(false);
  const [courseMessage, setCourseMessage] = useState('');

  const createLiveCourse = async () => {
    setCourseCreating(true);
    setCourseMessage('');

    try {
      // Admin token'ı localStorage'dan al
      const token = localStorage.getItem('token');
      if (!token) {
        setCourseMessage('Hata: Giriş yapmanız gerekiyor');
        setCourseCreating(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/courses/admin/course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Canlı Video Editörlük Eğitimi',
          description: '4 Seans interaktif canlı eğitim. Haftalık 2 saat canlı ders, özel WhatsApp destek grubu ve birebir geri bildirim.',
          thumbnail_url: null,
          order: 2,
          is_published: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCourseMessage(`Başarılı! Kurs ID: ${data.id} olarak oluşturuldu.`);
      } else {
        const error = await response.json();
        setCourseMessage(`Hata: ${error.detail || 'Kurs oluşturulamadı'}`);
      }
    } catch (err) {
      setCourseMessage(`Hata: ${err.message}`);
    } finally {
      setCourseCreating(false);
    }
  };
  const tools = [
    {
      title: 'Analytics Dashboard',
      description: 'Gelir, kullanıcı, sipariş, trafik istatistikleri. Dönüşüm hunisi, grafikler ve tablolar.',
      path: '/admin/analytics',
      icon: '📊',
      color: '#00ff9d',
    },
    {
      title: 'Quiz Yönetimi',
      description: 'Quiz oluştur, sorular ekle ve kurs içeriği sıralamasını düzenle.',
      path: '/admin/quizzes',
      icon: '📝',
      color: '#00d9ff',
    },
    {
      title: 'İçerik Sıralama',
      description: 'Kurs içindeki video ve quizlerin sırasını drag & drop ile düzenle.',
      path: '/admin/content-order',
      icon: '📋',
      color: '#ffbb00',
    },
    {
      title: 'Yorum Yönetimi',
      description: 'Öğrenci yorumlarını görüntüle, onayla veya gizle.',
      path: '/admin/reviews',
      icon: '💬',
      color: '#ff69b4',
    },
    {
      title: 'Referans Programı',
      description: 'Referans kodları ve indirim kodları yönetimi.',
      path: '/admin/referrals',
      icon: '🔗',
      color: '#9d4edd',
    },
    {
      title: 'Terk Edilmiş Sepetler',
      description: 'Ödeme yapmadan ayrılan kullanıcıları takip et ve recovery email gönder.',
      path: '/admin/abandoned-carts',
      icon: '🛒',
      color: '#ff4757',
    },
    {
      title: 'Email Şablonları',
      description: 'Doğrulama, ödeme onayı, şifre sıfırlama gibi email şablonlarını düzenle.',
      path: '/admin/email-templates',
      icon: '✉️',
      color: '#7000ff',
    },
    {
      title: 'İçerik Üretimi',
      description: 'Instagram için AI destekli viral içerik oluştur. Script, hashtag ve keyword önerileri.',
      path: '/icerik-uretimi',
      icon: '🎬',
      color: '#00ff9d',
    },
    {
      title: 'Microsoft Clarity',
      description: 'Kullanıcı ısı haritaları, session recordings ve davranış analizi.',
      path: 'https://clarity.microsoft.com/projects/view/utqj4i56a5/dashboard',
      icon: '🔥',
      color: '#ff9d00',
      external: true,
    },
    {
      title: 'Railway Dashboard',
      description: 'Backend deployment, logs ve environment variables.',
      path: 'https://railway.app/dashboard',
      icon: '🚂',
      color: '#a78bfa',
      external: true,
    },
    {
      title: 'Shopier Panel',
      description: 'Ödeme sistemi, siparişler ve ürün yönetimi.',
      path: 'https://www.shopier.com/seller',
      icon: '💳',
      color: '#ff6b35',
      external: true,
    },
  ];

  const quickLinks = [
    { label: 'Ana Sayfa', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Ürünler', path: '/urunler' },
    { label: 'Satın Al', path: '/satin-al' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/" style={styles.backLink}>← Ana Sayfa</Link>
        <h1 style={styles.title}>Admin Hub</h1>
        <p style={styles.subtitle}>Tüm yönetim araçları tek bir yerde</p>
      </div>

      {/* Admin Tools Grid */}
      <div style={styles.grid}>
        {tools.map((tool, index) => (
          tool.external ? (
            <a
              key={index}
              href={tool.path}
              target="_blank"
              rel="noopener noreferrer"
              style={{...styles.card, '--accent-color': tool.color}}
            >
              <div style={styles.cardIcon}>{tool.icon}</div>
              <h3 style={{...styles.cardTitle, color: tool.color}}>{tool.title}</h3>
              <p style={styles.cardDescription}>{tool.description}</p>
              <span style={styles.externalBadge}>↗ Harici</span>
            </a>
          ) : (
            <Link
              key={index}
              to={tool.path}
              style={{...styles.card, '--accent-color': tool.color}}
            >
              <div style={styles.cardIcon}>{tool.icon}</div>
              <h3 style={{...styles.cardTitle, color: tool.color}}>{tool.title}</h3>
              <p style={styles.cardDescription}>{tool.description}</p>
            </Link>
          )
        ))}
      </div>

      {/* Kurs Oluştur Bölümü */}
      <div style={styles.courseSection}>
        <h2 style={styles.sectionTitle}>🎓 Kurs Yönetimi</h2>
        <div style={styles.courseActions}>
          <button
            onClick={createLiveCourse}
            disabled={courseCreating}
            style={{
              ...styles.createCourseBtn,
              opacity: courseCreating ? 0.6 : 1,
              cursor: courseCreating ? 'not-allowed' : 'pointer'
            }}
          >
            {courseCreating ? '⏳ Oluşturuluyor...' : '🔴 Canlı Eğitim Kursu Oluştur (ID: 2)'}
          </button>
          {courseMessage && (
            <p style={{
              ...styles.courseMessage,
              color: courseMessage.includes('Başarılı') ? '#00ff9d' : '#ff4757'
            }}>
              {courseMessage}
            </p>
          )}
        </div>
        <p style={styles.courseNote}>
          Not: Bu buton veritabanında "Canlı Video Editörlük Eğitimi" kursunu oluşturur.
          899 TL'lik paketi alan kullanıcılar otomatik olarak bu kursa ve ana kursa erişim kazanır.
        </p>
      </div>

      {/* Quick Links */}
      <div style={styles.quickLinksSection}>
        <h2 style={styles.sectionTitle}>Hızlı Erişim</h2>
        <div style={styles.quickLinks}>
          {quickLinks.map((link, index) => (
            <Link key={index} to={link.path} style={styles.quickLink}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* API Endpoints Reference */}
      <div style={styles.apiSection}>
        <h2 style={styles.sectionTitle}>API Endpoints</h2>
        <div style={styles.apiList}>
          <div style={styles.apiItem}>
            <code style={styles.apiMethod}>GET</code>
            <code style={styles.apiPath}>/api/analytics/dashboard</code>
            <span style={styles.apiDesc}>Dashboard verileri</span>
          </div>
          <div style={styles.apiItem}>
            <code style={styles.apiMethod}>GET</code>
            <code style={styles.apiPath}>/api/analytics/users</code>
            <span style={styles.apiDesc}>Kullanıcı listesi</span>
          </div>
          <div style={styles.apiItem}>
            <code style={styles.apiMethod}>GET</code>
            <code style={styles.apiPath}>/api/analytics/orders</code>
            <span style={styles.apiDesc}>Sipariş listesi</span>
          </div>
          <div style={styles.apiItem}>
            <code style={styles.apiMethod}>POST</code>
            <code style={styles.apiPath}>/api/analytics/users/:id/toggle-access</code>
            <span style={styles.apiDesc}>Erişim aç/kapat</span>
          </div>
          <div style={styles.apiItem}>
            <code style={styles.apiMethod}>GET</code>
            <code style={styles.apiPath}>/api/admin/email-templates</code>
            <span style={styles.apiDesc}>Email şablonları</span>
          </div>
          <div style={styles.apiItem}>
            <code style={styles.apiMethod}>POST</code>
            <code style={styles.apiPath}>/api/payment/create-guest-order</code>
            <span style={styles.apiDesc}>Sipariş oluştur</span>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          Bu sayfa sadece admin erişimi içindir. URL'yi kimseyle paylaşma.
        </p>
        <p style={styles.footerPath}>
          <code>/0110</code>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    padding: '2rem',
    color: '#fff',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  backLink: {
    color: '#a0a0a0',
    fontSize: '0.9rem',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #00ff9d 0%, #7000ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#a0a0a0',
    fontSize: '1.1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    maxWidth: '1200px',
    margin: '0 auto 3rem',
  },
  card: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '2rem',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  cardIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  cardDescription: {
    color: '#a0a0a0',
    fontSize: '0.9rem',
    lineHeight: '1.5',
  },
  externalBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    padding: '0.25rem 0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '0.25rem',
    fontSize: '0.7rem',
    color: '#a0a0a0',
  },
  courseSection: {
    maxWidth: '1200px',
    margin: '0 auto 3rem',
    padding: '1.5rem',
    backgroundColor: 'rgba(255, 77, 77, 0.05)',
    border: '1px solid rgba(255, 77, 77, 0.2)',
    borderRadius: '1rem',
  },
  courseActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1rem',
  },
  createCourseBtn: {
    padding: '1rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#ff4d4d',
    border: 'none',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
    width: 'fit-content',
  },
  courseMessage: {
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  courseNote: {
    fontSize: '0.85rem',
    color: '#888',
    lineHeight: '1.5',
  },
  quickLinksSection: {
    maxWidth: '1200px',
    margin: '0 auto 3rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#fff',
  },
  quickLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  quickLink: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '2rem',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  apiSection: {
    maxWidth: '1200px',
    margin: '0 auto 3rem',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  apiList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  apiItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '0.5rem',
    flexWrap: 'wrap',
  },
  apiMethod: {
    padding: '0.25rem 0.5rem',
    backgroundColor: 'rgba(0, 255, 157, 0.2)',
    color: '#00ff9d',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    minWidth: '50px',
    textAlign: 'center',
  },
  apiPath: {
    color: '#00d9ff',
    fontSize: '0.85rem',
    flex: 1,
    minWidth: '250px',
  },
  apiDesc: {
    color: '#666',
    fontSize: '0.8rem',
  },
  footer: {
    textAlign: 'center',
    marginTop: '3rem',
    paddingTop: '2rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    color: '#666',
    fontSize: '0.85rem',
    marginBottom: '0.5rem',
  },
  footerPath: {
    color: '#a0a0a0',
  },
};
