import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Dashboard() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/giris');
    }
  }, [loading, isAuthenticated, navigate]);

  // Dropdown dışına tıklanınca kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Yükleniyor...</p>
        </div>
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/" style={styles.logo}>VideoMaster</Link>

        <div style={styles.headerRight}>
          <Link to="/" style={styles.homeLink}>Ana Sayfa</Link>

          <div style={styles.profileDropdown} ref={profileRef}>
            <button
              style={styles.profileBtn}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div style={styles.profileAvatar}>{getInitials()}</div>
              <span style={styles.profileName}>{user.full_name?.split(' ')[0] || 'Hesabım'}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{ opacity: 0.5, transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </button>

            {isProfileOpen && (
              <div style={styles.dropdownMenu}>
                <div style={styles.dropdownHeader}>
                  <div style={styles.dropdownAvatar}>{getInitials()}</div>
                  <div style={styles.dropdownInfo}>
                    <div style={styles.dropdownName}>{user.full_name || 'Kullanıcı'}</div>
                    <div style={styles.dropdownEmail}>{user.email}</div>
                    {user.has_access && (
                      <span style={styles.accessBadge}>Premium Üye</span>
                    )}
                  </div>
                </div>
                <div style={styles.dropdownDivider}></div>
                <Link to="/profil" style={styles.dropdownItem} onClick={() => setIsProfileOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Profilim</span>
                </Link>
                <div style={styles.dropdownDivider}></div>
                <button style={{...styles.dropdownItem, ...styles.logoutItem}} onClick={handleLogout}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Çıkış Yap</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.welcome}>
          <h1 style={styles.title}>Hoş Geldin, {user.full_name?.split(' ')[0] || 'Kullanıcı'}!</h1>
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
  homeLink: {
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
  profileDropdown: {
    position: 'relative',
  },
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.4rem 0.8rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '2rem',
    cursor: 'pointer',
    color: '#fff',
    transition: 'all 0.2s',
  },
  profileAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.85rem',
    color: '#000',
  },
  profileName: {
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 'calc(100% + 0.5rem)',
    right: 0,
    minWidth: '280px',
    background: 'rgba(20,20,20,0.98)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '1rem',
    padding: '0.5rem',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
    zIndex: 101,
  },
  dropdownHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
  },
  dropdownAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1.1rem',
    color: '#000',
  },
  dropdownInfo: {
    flex: 1,
    overflow: 'hidden',
  },
  dropdownName: {
    fontWeight: '600',
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dropdownEmail: {
    fontSize: '0.8rem',
    color: '#a0a0a0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  accessBadge: {
    display: 'inline-block',
    marginTop: '0.25rem',
    padding: '0.15rem 0.5rem',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    color: '#000',
    fontSize: '0.65rem',
    fontWeight: '600',
    borderRadius: '1rem',
  },
  dropdownDivider: {
    height: '1px',
    background: 'rgba(255,255,255,0.1)',
    margin: '0.5rem 0',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.75rem',
    color: '#a0a0a0',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
    textDecoration: 'none',
    fontSize: '0.95rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  logoutItem: {
    color: '#ff4757',
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
