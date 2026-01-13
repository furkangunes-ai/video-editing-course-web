import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Award, Download, ExternalLink, Loader2, Copy, Check, Users, Gift } from 'lucide-react';

const API_BASE_URL = 'https://videomaster-backend-production.up.railway.app';

export function Dashboard() {
  const { user, loading, logout, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Sertifika state'leri
  const [certificates, setCertificates] = useState([]);
  const [certificateEligibility, setCertificateEligibility] = useState(null);
  const [certLoading, setCertLoading] = useState(false);
  const [certGenerating, setCertGenerating] = useState(false);

  // Referans state'leri
  const [referralData, setReferralData] = useState(null);
  const [referralStats, setReferralStats] = useState(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Kurslar state'i
  const [myCourses, setMyCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

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

  // Sertifikaları ve uygunluğu kontrol et
  useEffect(() => {
    if (user?.has_access && token) {
      fetchCertificates();
      checkCertificateEligibility(1); // Kurs ID: 1
    }
  }, [user, token]);

  // Kullanıcının kurslarını yükle
  useEffect(() => {
    if (token) {
      fetchMyCourses();
    }
  }, [token]);

  const fetchMyCourses = async () => {
    setCoursesLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/courses/my-courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyCourses(data);
      } else if (res.status === 404 && user?.has_access) {
        // Fallback: Yeni endpoint yoksa has_access ile çalış
        setMyCourses([{
          id: 1,
          title: "Video Editörlüğü Ustalık Sınıfı",
          description: "Profesyonel video editör olma yolculuğunda ihtiyacın olan her şey",
          completion_percentage: 0
        }]);
      }
    } catch (err) {
      console.error('Kurslar yüklenemedi:', err);
      // Fallback for network errors
      if (user?.has_access) {
        setMyCourses([{
          id: 1,
          title: "Video Editörlüğü Ustalık Sınıfı",
          description: "Profesyonel video editör olma yolculuğunda ihtiyacın olan her şey",
          completion_percentage: 0
        }]);
      }
    } finally {
      setCoursesLoading(false);
    }
  };

  // Referans bilgilerini yükle
  useEffect(() => {
    if (token) {
      fetchReferralData();
    }
  }, [token]);

  const fetchCertificates = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/certificates/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCertificates(data);
      }
    } catch (err) {
      console.error('Sertifikalar yüklenemedi:', err);
    }
  };

  const checkCertificateEligibility = async (courseId) => {
    setCertLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/certificates/check/${courseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCertificateEligibility(data);
      }
    } catch (err) {
      console.error('Sertifika uygunluğu kontrol edilemedi:', err);
    } finally {
      setCertLoading(false);
    }
  };

  const generateCertificate = async (courseId) => {
    setCertGenerating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/certificates/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ course_id: courseId })
      });
      if (res.ok) {
        const data = await res.json();
        setCertificates(prev => [...prev, data]);
        setCertificateEligibility(prev => ({ ...prev, has_certificate: true }));
      } else {
        const err = await res.json();
        alert(err.detail || 'Sertifika oluşturulamadı');
      }
    } catch (err) {
      console.error('Sertifika oluşturulamadı:', err);
      alert('Bir hata oluştu');
    } finally {
      setCertGenerating(false);
    }
  };

  const fetchReferralData = async () => {
    try {
      const [codeRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/referrals/my-code`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/api/referrals/my-stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (codeRes.ok) {
        const data = await codeRes.json();
        setReferralData(data);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setReferralStats(data);
      }
    } catch (err) {
      console.error('Referans bilgileri yuklenemedi:', err);
    }
  };

  const copyReferralCode = () => {
    if (referralData?.referral_code) {
      navigator.clipboard.writeText(referralData.referral_code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const copyReferralLink = () => {
    if (referralData?.referral_code) {
      const link = `${window.location.origin}/kayit?ref=${referralData.referral_code}`;
      navigator.clipboard.writeText(link);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

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

        {myCourses.length > 0 ? (
          <>
            <div style={styles.courses}>
              <h2 style={styles.sectionTitle}>Kurslarım</h2>
              {coursesLoading ? (
                <div style={styles.certLoading}>
                  <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Kurslar yükleniyor...</span>
                </div>
              ) : (
                <div style={styles.courseGrid}>
                  {myCourses.map(course => (
                    <div key={course.id} style={styles.courseCard}>
                      <div style={{
                        ...styles.courseThumbnail,
                        background: course.id === 2
                          ? 'linear-gradient(135deg, #ff4d4d 0%, #cc0000 100%)'
                          : 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)'
                      }}>
                        <span style={styles.playIcon}>▶</span>
                      </div>
                      <h3 style={styles.courseTitle}>{course.title}</h3>
                      <p style={styles.courseProgress}>
                        İlerleme: {course.completion_percentage || 0}%
                      </p>
                      <div style={styles.progressBar}>
                        <div style={{
                          ...styles.progressFill,
                          width: `${course.completion_percentage || 0}%`,
                          background: course.id === 2 ? '#ff4d4d' : '#00ff9d'
                        }}></div>
                      </div>
                      <Link to={`/kurs/${course.id}`} style={{
                        ...styles.continueBtn,
                        background: course.id === 2
                          ? 'linear-gradient(135deg, #ff4d4d 0%, #cc0000 100%)'
                          : 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)'
                      }}>
                        {course.completion_percentage > 0 ? 'Devam Et' : 'Başla'}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sertifikalar Bölümü */}
            <div style={styles.certificateSection}>
              <h2 style={styles.sectionTitle}>
                <Award size={24} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Sertifikalarım
              </h2>

              {certLoading ? (
                <div style={styles.certLoading}>
                  <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Yükleniyor...</span>
                </div>
              ) : (
                <>
                  {/* Mevcut Sertifikalar */}
                  {certificates.length > 0 && (
                    <div style={styles.certGrid}>
                      {certificates.map(cert => (
                        <div key={cert.id} style={styles.certCard}>
                          <div style={styles.certHeader}>
                            <Award size={32} color="#00ff9d" />
                            <span style={styles.certBadge}>Tamamlama Sertifikası</span>
                          </div>
                          <h3 style={styles.certTitle}>{cert.course_title}</h3>
                          <p style={styles.certDate}>
                            {new Date(cert.completion_date).toLocaleDateString('tr-TR', {
                              day: 'numeric', month: 'long', year: 'numeric'
                            })}
                          </p>
                          <p style={styles.certCode}>Kod: {cert.certificate_code}</p>
                          <div style={styles.certActions}>
                            <a
                              href={`${API_BASE_URL}/api/certificates/download/${cert.certificate_code}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={styles.certBtn}
                            >
                              <Download size={16} />
                              İndir
                            </a>
                            <Link to={`/sertifika/${cert.certificate_code}`} style={styles.certBtnSecondary}>
                              <ExternalLink size={16} />
                              Görüntüle
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Sertifika Uygunluk Durumu */}
                  {certificateEligibility && !certificateEligibility.has_certificate && (
                    <div style={styles.eligibilityCard}>
                      {certificateEligibility.eligible ? (
                        <>
                          <div style={styles.eligibleIcon}>🎉</div>
                          <h3 style={styles.eligibleTitle}>Tebrikler! Sertifikanızı Alabilirsiniz</h3>
                          <p style={styles.eligibleText}>
                            Kursu %{certificateEligibility.completion_percentage} oranında tamamladınız.
                          </p>
                          <button
                            onClick={() => generateCertificate(1)}
                            disabled={certGenerating}
                            style={styles.generateBtn}
                          >
                            {certGenerating ? (
                              <>
                                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                Oluşturuluyor...
                              </>
                            ) : (
                              <>
                                <Award size={18} />
                                Sertifika Oluştur
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <>
                          <div style={styles.progressIcon}>📊</div>
                          <h3 style={styles.progressTitle}>Sertifika İçin İlerlemeniz</h3>
                          <div style={styles.progressBarContainer}>
                            <div
                              style={{
                                ...styles.progressBar,
                                width: `${certificateEligibility.completion_percentage}%`
                              }}
                            />
                          </div>
                          <p style={styles.progressText}>
                            %{certificateEligibility.completion_percentage} / %{certificateEligibility.required_percentage} tamamlandı
                          </p>
                          <p style={styles.progressHint}>
                            Sertifika almak için kursu en az %80 oranında tamamlamanız gerekiyor.
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  {certificates.length === 0 && !certificateEligibility && (
                    <p style={styles.noCerts}>Henuz sertifikaniz bulunmuyor.</p>
                  )}
                </>
              )}
            </div>

          </>
        ) : (
          <div style={styles.noaccess}>
            <div style={styles.lockIcon}>🔒</div>
            <h2 style={styles.noaccessTitle}>Henüz Kurs Erişiminiz Yok</h2>
            <p style={styles.noaccessText}>
              Kurslara erişmek için satın alma işlemini tamamlayın.
            </p>
            <Link to="/urunler" style={styles.buyBtn}>Kursu Satın Al</Link>
          </div>
        )}

        {/* Referans Programi Bolumu - Tum kullanicilar gorebilir */}
        <div style={styles.referralSection}>
          <h2 style={styles.sectionTitle}>
            <Gift size={24} style={{ marginRight: '0.5rem', verticalAlign: 'middle', color: '#a78bfa' }} />
            Referans Programi
          </h2>

          <div style={styles.referralCard}>
            <div style={styles.referralHeader}>
              <div style={styles.referralInfo}>
                <h3 style={styles.referralTitle}>Arkadaslarini Davet Et, Kazan!</h3>
                <p style={styles.referralDesc}>
                  Her basarili referanstan 50 TL indirim kodu kazan. Davet ettigin kisi de 30 TL indirim kazanir!
                </p>
              </div>
            </div>

            {referralData?.referral_code && (
              <div style={styles.referralCodeBox}>
                <div style={styles.codeLabel}>Referans Kodun</div>
                <div style={styles.codeWrapper}>
                  <code style={styles.referralCode}>{referralData.referral_code}</code>
                  <button onClick={copyReferralCode} style={styles.copyBtn}>
                    {codeCopied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
                <button onClick={copyReferralLink} style={styles.copyLinkBtn}>
                  Referans Linkini Kopyala
                </button>
              </div>
            )}

            {referralStats && (
              <div style={styles.referralStats}>
                <div style={styles.statItem}>
                  <Users size={20} style={{ color: '#00d9ff' }} />
                  <div style={styles.statInfo}>
                    <span style={styles.statValue}>{referralStats.total_referrals || 0}</span>
                    <span style={styles.statLabel}>Toplam Davet</span>
                  </div>
                </div>
                <div style={styles.statItem}>
                  <Check size={20} style={{ color: '#00ff9d' }} />
                  <div style={styles.statInfo}>
                    <span style={styles.statValue}>{referralStats.active_referrals || 0}</span>
                    <span style={styles.statLabel}>Basarili</span>
                  </div>
                </div>
                <div style={styles.statItem}>
                  <Gift size={20} style={{ color: '#a78bfa' }} />
                  <div style={styles.statInfo}>
                    <span style={styles.statValue}>{referralStats.total_earnings || 0} TL</span>
                    <span style={styles.statLabel}>Kazanc</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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
    marginBottom: '0.5rem',
  },
  progressBar: {
    width: '100%',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '3px',
    marginBottom: '1rem',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
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
  // Sertifika stilleri
  certificateSection: {
    marginTop: '3rem',
  },
  certLoading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: '2rem',
    color: '#a0a0a0',
  },
  certGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  certCard: {
    background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.05) 0%, rgba(112, 0, 255, 0.05) 100%)',
    border: '1px solid rgba(0, 255, 157, 0.2)',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  certHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  certBadge: {
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    color: '#000',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  certTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  certDate: {
    color: '#a0a0a0',
    fontSize: '0.85rem',
    marginBottom: '0.25rem',
  },
  certCode: {
    color: '#666',
    fontSize: '0.8rem',
    fontFamily: 'monospace',
    marginBottom: '1rem',
  },
  certActions: {
    display: 'flex',
    gap: '0.75rem',
  },
  certBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    color: '#000',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  certBtnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  eligibilityCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '2rem',
    textAlign: 'center',
  },
  eligibleIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  eligibleTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#00ff9d',
  },
  eligibleText: {
    color: '#a0a0a0',
    marginBottom: '1.5rem',
  },
  generateBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    color: '#000',
    border: 'none',
    borderRadius: '2rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  progressIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  progressTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  progressBarContainer: {
    width: '100%',
    maxWidth: '400px',
    height: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    margin: '0 auto 1rem',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #00ff9d 0%, #00cc7d 100%)',
    borderRadius: '6px',
    transition: 'width 0.5s ease',
  },
  progressText: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  progressHint: {
    color: '#a0a0a0',
    fontSize: '0.9rem',
  },
  noCerts: {
    textAlign: 'center',
    color: '#a0a0a0',
    padding: '2rem',
  },
  // Referans stilleri
  referralSection: {
    marginTop: '3rem',
  },
  referralCard: {
    background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.05) 0%, rgba(112, 0, 255, 0.05) 100%)',
    border: '1px solid rgba(167, 139, 250, 0.2)',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  referralHeader: {
    marginBottom: '1.5rem',
  },
  referralInfo: {},
  referralTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#fff',
  },
  referralDesc: {
    color: '#a0a0a0',
    fontSize: '0.9rem',
    lineHeight: '1.5',
  },
  referralCodeBox: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  codeLabel: {
    fontSize: '0.8rem',
    color: '#666',
    marginBottom: '0.5rem',
  },
  codeWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  referralCode: {
    fontSize: '1.5rem',
    fontWeight: '700',
    letterSpacing: '0.15em',
    color: '#a78bfa',
    background: 'rgba(167, 139, 250, 0.2)',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
  },
  copyBtn: {
    background: 'rgba(167, 139, 250, 0.2)',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    color: '#a78bfa',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyLinkBtn: {
    background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '2rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  referralStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '1rem',
    borderRadius: '0.75rem',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    fontSize: '1.25rem',
    fontWeight: '700',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#666',
  },
};
