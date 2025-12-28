import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Profile() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/giris');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Yükleniyor...</p>
        </div>
        <style>{spinnerKeyframes}</style>
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

  const getInitials = () => {
    if (user.full_name) {
      return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.email?.charAt(0).toUpperCase() || 'U';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Bilinmiyor';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/" style={styles.logo}>VideoMaster</Link>
        <div style={styles.headerRight}>
          <Link to="/dashboard" style={styles.headerLink}>Kurslarım</Link>
          <Link to="/" style={styles.headerLink}>Ana Sayfa</Link>
        </div>
      </div>

      <div style={styles.content}>
        {/* Profile Header */}
        <div style={styles.profileHeader}>
          <div style={styles.avatarLarge}>{getInitials()}</div>
          <div style={styles.profileInfo}>
            <h1 style={styles.userName}>{user.full_name || 'Kullanıcı'}</h1>
            <p style={styles.userEmail}>{user.email}</p>
            <div style={styles.badges}>
              {user.is_verified && (
                <span style={styles.verifiedBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Email Doğrulandı
                </span>
              )}
              {user.has_access && (
                <span style={styles.premiumBadge}>Premium Üye</span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={activeTab === 'info' ? {...styles.tab, ...styles.tabActive} : styles.tab}
            onClick={() => setActiveTab('info')}
          >
            Hesap Bilgileri
          </button>
          <button
            style={activeTab === 'subscription' ? {...styles.tab, ...styles.tabActive} : styles.tab}
            onClick={() => setActiveTab('subscription')}
          >
            Üyelik
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <div style={styles.tabContent}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Kişisel Bilgiler</h3>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Ad Soyad</span>
                  <span style={styles.infoValue}>{user.full_name || '-'}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Email</span>
                  <span style={styles.infoValue}>{user.email}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Kayıt Tarihi</span>
                  <span style={styles.infoValue}>{formatDate(user.created_at)}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Email Durumu</span>
                  <span style={{...styles.infoValue, color: user.is_verified ? '#00ff9d' : '#ff4757'}}>
                    {user.is_verified ? 'Doğrulanmış' : 'Doğrulanmamış'}
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Hesap İşlemleri</h3>
              <div style={styles.actionButtons}>
                <Link to="/sifremi-unuttum" style={styles.actionBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Şifre Değiştir
                </Link>
                <button style={{...styles.actionBtn, ...styles.logoutBtn}} onClick={handleLogout}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div style={styles.tabContent}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Üyelik Durumu</h3>
              {user.has_access ? (
                <div style={styles.subscriptionActive}>
                  <div style={styles.subscriptionIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00ff9d" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h4 style={styles.subscriptionTitle}>Premium Üyelik Aktif</h4>
                  <p style={styles.subscriptionText}>
                    Tüm kurslara ve içeriklere sınırsız erişiminiz bulunuyor.
                  </p>
                  <Link to="/dashboard" style={styles.goToCourses}>
                    Kurslara Git
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                </div>
              ) : (
                <div style={styles.subscriptionInactive}>
                  <div style={styles.subscriptionIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a0a0a0" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <h4 style={styles.subscriptionTitle}>Premium Üyelik Yok</h4>
                  <p style={styles.subscriptionText}>
                    Kurslara erişmek için premium üyelik satın alın.
                  </p>
                  <Link to="/#products" style={styles.buyBtn}>
                    Üyelik Satın Al
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <style>{spinnerKeyframes}</style>
    </div>
  );
}

const spinnerKeyframes = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#fff',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '1rem',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255,255,255,0.1)',
    borderTopColor: '#00ff9d',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#a0a0a0',
    fontSize: '0.9rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(10,10,10,0.8)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  headerLink: {
    color: '#a0a0a0',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '700',
    background: 'linear-gradient(to right, #00ff9d, #7000ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textDecoration: 'none',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '2rem',
    padding: '2rem',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '1.5rem',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  avatarLarge: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1.75rem',
    color: '#000',
    flexShrink: 0,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: 0,
    marginBottom: '0.25rem',
  },
  userEmail: {
    color: '#a0a0a0',
    margin: 0,
    marginBottom: '0.75rem',
  },
  badges: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  verifiedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.25rem 0.75rem',
    backgroundColor: 'rgba(0,255,157,0.1)',
    color: '#00ff9d',
    fontSize: '0.75rem',
    fontWeight: '600',
    borderRadius: '1rem',
  },
  premiumBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.75rem',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    color: '#000',
    fontSize: '0.75rem',
    fontWeight: '600',
    borderRadius: '1rem',
  },
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '0.5rem',
  },
  tab: {
    padding: '0.75rem 1.5rem',
    background: 'none',
    border: 'none',
    color: '#a0a0a0',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
  },
  tabActive: {
    backgroundColor: 'rgba(0,255,157,0.1)',
    color: '#00ff9d',
  },
  tabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: 0,
    marginBottom: '1.25rem',
    color: '#fff',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.25rem',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  infoLabel: {
    fontSize: '0.8rem',
    color: '#a0a0a0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  infoValue: {
    fontSize: '1rem',
    color: '#fff',
    fontWeight: '500',
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '0.75rem',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: '500',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,71,87,0.1)',
    borderColor: 'rgba(255,71,87,0.3)',
    color: '#ff4757',
  },
  subscriptionActive: {
    textAlign: 'center',
    padding: '2rem',
  },
  subscriptionInactive: {
    textAlign: 'center',
    padding: '2rem',
  },
  subscriptionIcon: {
    marginBottom: '1rem',
  },
  subscriptionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: 0,
    marginBottom: '0.5rem',
  },
  subscriptionText: {
    color: '#a0a0a0',
    margin: 0,
    marginBottom: '1.5rem',
  },
  goToCourses: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    color: '#000',
    borderRadius: '2rem',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  buyBtn: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    color: '#000',
    borderRadius: '2rem',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
};
