import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { resendCode, verifyEmail } from '../api/authApi';

const API_BASE_URL = 'https://videomaster-backend-production.up.railway.app';

export function Profile() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationStep, setVerificationStep] = useState('idle'); // idle, sent, verifying
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState('');

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

  const handleSendVerificationCode = async () => {
    setVerificationError('');
    setVerificationStep('sending');
    try {
      await resendCode(user.email);
      setVerificationStep('sent');
      setVerificationSuccess('Doğrulama kodu email adresinize gönderildi.');
    } catch (error) {
      setVerificationError(error.message || 'Kod gönderilemedi');
      setVerificationStep('idle');
    }
  };

  const handleVerifyEmail = async () => {
    if (verificationCode.length !== 6) {
      setVerificationError('Lütfen 6 haneli kodu girin');
      return;
    }
    setVerificationError('');
    setVerificationStep('verifying');
    try {
      await verifyEmail(user.email, verificationCode);
      setVerificationSuccess('Email adresiniz başarıyla doğrulandı! Sayfa yenileniyor...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setVerificationError(error.message || 'Doğrulama başarısız');
      setVerificationStep('sent');
    }
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
                  {user.is_verified ? (
                    <span style={{...styles.infoValue, color: '#00ff9d', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      Doğrulanmış
                    </span>
                  ) : (
                    <div style={styles.verificationSection}>
                      {verificationStep === 'idle' && (
                        <button style={styles.verifyBtn} onClick={handleSendVerificationCode}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                          Email Doğrula
                        </button>
                      )}
                      {verificationStep === 'sending' && (
                        <span style={styles.verifyingText}>Kod gönderiliyor...</span>
                      )}
                      {verificationStep === 'sent' && (
                        <div style={styles.codeInputSection}>
                          <p style={styles.codeHint}>6 haneli doğrulama kodunu girin:</p>
                          <div style={styles.codeInputRow}>
                            <input
                              type="text"
                              maxLength="6"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                              placeholder="000000"
                              style={styles.codeInput}
                            />
                            <button
                              style={styles.verifySubmitBtn}
                              onClick={handleVerifyEmail}
                              disabled={verificationStep === 'verifying'}
                            >
                              {verificationStep === 'verifying' ? 'Doğrulanıyor...' : 'Doğrula'}
                            </button>
                          </div>
                          <button style={styles.resendBtn} onClick={handleSendVerificationCode}>
                            Tekrar Gönder
                          </button>
                        </div>
                      )}
                      {verificationError && <p style={styles.errorText}>{verificationError}</p>}
                      {verificationSuccess && <p style={styles.successText}>{verificationSuccess}</p>}
                    </div>
                  )}
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
              <h3 style={styles.cardTitle}>Satın Alınan Kurslar</h3>
              {user.has_access ? (
                <div style={styles.coursesList}>
                  {/* Video Editörlüğü Ustalık Sınıfı */}
                  <div style={styles.courseItem}>
                    <div style={styles.courseItemLeft}>
                      <div style={styles.courseItemIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ff9d" strokeWidth="2">
                          <polygon points="23 7 16 12 23 17 23 7"></polygon>
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                        </svg>
                      </div>
                      <div style={styles.courseItemInfo}>
                        <h4 style={styles.courseItemTitle}>Video Editörlüğü Ustalık Sınıfı</h4>
                        <p style={styles.courseItemDesc}>Sıfırdan profesyonel video editör olun</p>
                      </div>
                    </div>
                    <div style={styles.courseItemRight}>
                      <span style={styles.accessActiveBadge}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        Erişim Aktif
                      </span>
                      <Link to="/kurs/1" style={styles.goToCourseBtn}>
                        Kursa Git
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={styles.subscriptionInactive}>
                  <div style={styles.subscriptionIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a0a0a0" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <h4 style={styles.subscriptionTitle}>Henüz Kurs Satın Almadınız</h4>
                  <p style={styles.subscriptionText}>
                    Video editörlüğü kursuna erişmek için satın alın.
                  </p>
                  <Link to="/#products" style={styles.buyBtn}>
                    Kursu Satın Al
                  </Link>
                </div>
              )}
            </div>

            {/* Diğer Kurslar - Yakında */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Diğer Kurslar</h3>
              <div style={styles.comingSoonSection}>
                <div style={styles.comingSoonIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7000ff" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <p style={styles.comingSoonText}>Yeni kurslar yakında eklenecek!</p>
              </div>
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
  // Email verification styles
  verificationSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  verifyBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    color: '#000',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  verifyingText: {
    color: '#a0a0a0',
    fontSize: '0.9rem',
  },
  codeInputSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  codeHint: {
    color: '#a0a0a0',
    fontSize: '0.85rem',
    margin: 0,
  },
  codeInputRow: {
    display: 'flex',
    gap: '0.5rem',
  },
  codeInput: {
    width: '100px',
    padding: '0.5rem 0.75rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    letterSpacing: '0.2em',
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '0.5rem',
    color: '#fff',
    outline: 'none',
  },
  verifySubmitBtn: {
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    color: '#000',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  resendBtn: {
    background: 'none',
    border: 'none',
    color: '#a0a0a0',
    fontSize: '0.8rem',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
    textAlign: 'left',
  },
  errorText: {
    color: '#ff4757',
    fontSize: '0.85rem',
    margin: 0,
  },
  successText: {
    color: '#00ff9d',
    fontSize: '0.85rem',
    margin: 0,
  },
  // Course list styles
  coursesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  courseItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem',
    backgroundColor: 'rgba(0,255,157,0.05)',
    border: '1px solid rgba(0,255,157,0.2)',
    borderRadius: '1rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  courseItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  courseItemIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '0.75rem',
    backgroundColor: 'rgba(0,255,157,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseItemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  courseItemTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#fff',
    margin: 0,
  },
  courseItemDesc: {
    fontSize: '0.85rem',
    color: '#a0a0a0',
    margin: 0,
  },
  courseItemRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  accessActiveBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.35rem 0.75rem',
    backgroundColor: 'rgba(0,255,157,0.1)',
    color: '#00ff9d',
    fontSize: '0.8rem',
    fontWeight: '600',
    borderRadius: '1rem',
  },
  goToCourseBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    color: '#000',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.85rem',
  },
  comingSoonSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    gap: '0.75rem',
  },
  comingSoonIcon: {
    opacity: 0.7,
  },
  comingSoonText: {
    color: '#a0a0a0',
    fontSize: '0.95rem',
    margin: 0,
  },
};
