import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Dashboard() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/giris');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Yükleniyor...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/" style={styles.logo}>VideoMaster</Link>
        <button onClick={handleLogout} style={styles.logoutBtn}>Çıkış Yap</button>
      </div>

      <div style={styles.content}>
        <div style={styles.welcome}>
          <h1 style={styles.title}>Hoş Geldin, {user.full_name || 'Kullanıcı'}!</h1>
          <p style={styles.subtitle}>{user.email}</p>
        </div>

        {user.has_access ? (
          <div style={styles.courses}>
            <h2 style={styles.sectionTitle}>Kurslarım</h2>
            <div style={styles.courseGrid}>
              <div style={styles.courseCard}>
                <div style={styles.courseThumbnail}>
                  <span style={styles.playIcon}>▶</span>
                </div>
                <h3 style={styles.courseTitle}>Video Editörlüğü Ustalık Sınıfı</h3>
                <p style={styles.courseProgress}>İlerleme: 0%</p>
                <Link to="/kurs/1" style={styles.continueBtn}>Devam Et</Link>
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.noaccess}>
            <div style={styles.lockIcon}>🔒</div>
            <h2 style={styles.noaccessTitle}>Henüz Kurs Erişiminiz Yok</h2>
            <p style={styles.noaccessText}>
              Kurslara erişmek için satın alma işlemini tamamlayın.
            </p>
            <Link to="/#products" style={styles.buyBtn}>Kursu Satın Al</Link>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#fff',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    color: '#a0a0a0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '700',
    background: 'linear-gradient(to right, #00ff9d, #7000ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textDecoration: 'none',
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '0.5rem',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  welcome: {
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#a0a0a0',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
  },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  courseCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  courseThumbnail: {
    backgroundColor: 'rgba(0,255,157,0.1)',
    borderRadius: '0.75rem',
    height: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  playIcon: {
    fontSize: '3rem',
    color: '#00ff9d',
  },
  courseTitle: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
  },
  courseProgress: {
    color: '#a0a0a0',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  continueBtn: {
    display: 'block',
    textAlign: 'center',
    padding: '0.75rem',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    color: '#000',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontWeight: '600',
  },
  noaccess: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '1.5rem',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  lockIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  noaccessTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  noaccessText: {
    color: '#a0a0a0',
    marginBottom: '2rem',
  },
  buyBtn: {
    display: 'inline-block',
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    color: '#000',
    borderRadius: '2rem',
    textDecoration: 'none',
    fontWeight: '600',
  },
};
