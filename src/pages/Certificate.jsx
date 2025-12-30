import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { CheckCircle, Download, Share2, ExternalLink, Award, Clock, BookOpen } from 'lucide-react';

const API_BASE_URL = 'https://videomaster-backend-production.up.railway.app';

export function Certificate() {
  const { code } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (code) {
      verifyCertificate();
    }
  }, [code]);

  const verifyCertificate = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/certificates/verify/${code}`);
      const data = await response.json();

      if (data.valid) {
        setCertificate(data.certificate);
      } else {
        setError(data.message || 'Sertifika bulunamadı');
      }
    } catch (err) {
      setError('Sertifika doğrulanamadı');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.open(`${API_BASE_URL}/api/certificates/download/${code}`, '_blank');
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${certificate.recipient_name} - Sertifika`,
          text: `${certificate.recipient_name}, ${certificate.course_title} eğitimini tamamladı!`,
          url: url
        });
      } catch (err) {
        // Kullanıcı paylaşımı iptal etti
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link panoya kopyalandı!');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={styles.container}>
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Sertifika doğrulanıyor...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div style={styles.container}>
          <div style={styles.errorCard}>
            <div style={styles.errorIcon}>✗</div>
            <h1 style={styles.errorTitle}>Sertifika Bulunamadı</h1>
            <p style={styles.errorText}>{error}</p>
            <p style={styles.errorCode}>Kod: {code}</p>
            <Link to="/" style={styles.backButton}>Ana Sayfaya Dön</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.verifiedBadge}>
          <CheckCircle size={20} />
          <span>Doğrulanmış Sertifika</span>
        </div>

        <div style={styles.certificateCard}>
          <div style={styles.cardHeader}>
            <div style={styles.logo}>VIDEOMASTER</div>
            <div style={styles.type}>
              {certificate.certificate_type === 'completion' ? 'Tamamlama Sertifikası' : 'Katılım Sertifikası'}
            </div>
          </div>

          <div style={styles.cardContent}>
            <h1 style={styles.recipient}>{certificate.recipient_name}</h1>

            <p style={styles.courseLabel}>aşağıdaki eğitimi başarıyla tamamlamıştır:</p>
            <h2 style={styles.courseTitle}>{certificate.course_title}</h2>

            <div style={styles.stats}>
              <div style={styles.stat}>
                <BookOpen size={20} />
                <span style={styles.statValue}>{certificate.completed_lessons}/{certificate.total_lessons}</span>
                <span style={styles.statLabel}>Ders</span>
              </div>
              <div style={styles.stat}>
                <Clock size={20} />
                <span style={styles.statValue}>{certificate.completion_date}</span>
                <span style={styles.statLabel}>Tamamlanma</span>
              </div>
            </div>

            <div style={styles.codeSection}>
              <Award size={16} />
              <span>Sertifika Kodu: <strong>{certificate.certificate_code}</strong></span>
            </div>
          </div>

          <div style={styles.disclaimer}>
            Bu belge, katılımcının ilgili eğitim programına katılımını ve tamamlamasını gösterir.
            Kişisel gelişim ve eğitim amaçlıdır. Herhangi bir resmi yeterlilik yerine geçmez.
          </div>
        </div>

        <div style={styles.actions}>
          <button onClick={handleDownload} style={styles.downloadBtn}>
            <Download size={20} />
            İndir (HTML)
          </button>
          <button onClick={handleShare} style={styles.shareBtn}>
            <Share2 size={20} />
            Paylaş
          </button>
        </div>

        <p style={styles.printTip}>
          💡 İpucu: İndirilen HTML dosyasını tarayıcıda açıp Ctrl+P ile PDF olarak kaydedin.
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    padding: '120px 1rem 4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  loading: {
    textAlign: 'center',
    color: '#a0a0a0',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(0, 255, 157, 0.2)',
    borderTop: '3px solid #00ff9d',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem',
  },
  verifiedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    border: '1px solid rgba(0, 255, 157, 0.3)',
    borderRadius: '2rem',
    color: '#00ff9d',
    marginBottom: '2rem',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  certificateCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '2px solid #00ff9d',
    borderRadius: '1.5rem',
    padding: '3rem',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
  },
  cardHeader: {
    marginBottom: '2rem',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#00ff9d',
    letterSpacing: '3px',
    marginBottom: '0.5rem',
  },
  type: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  cardContent: {},
  recipient: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '1.5rem',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00d9ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  courseLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
  },
  courseTitle: {
    fontSize: '1.5rem',
    color: '#fff',
    fontWeight: '600',
    marginBottom: '2rem',
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    color: '#00ff9d',
  },
  statValue: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#fff',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
  },
  codeSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '0.9rem',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '0.5rem',
  },
  disclaimer: {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.4)',
    lineHeight: '1.5',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  downloadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    color: '#000',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  shareBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    backgroundColor: 'transparent',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  printTip: {
    marginTop: '1.5rem',
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '0.85rem',
  },
  errorCard: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 71, 87, 0.3)',
    borderRadius: '1.5rem',
    maxWidth: '400px',
  },
  errorIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    fontSize: '2.5rem',
    color: '#ff4757',
  },
  errorTitle: {
    color: '#fff',
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  errorText: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '0.5rem',
  },
  errorCode: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '0.85rem',
    fontFamily: 'monospace',
    marginBottom: '2rem',
  },
  backButton: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '0.5rem',
  },
};
