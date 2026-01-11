import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, User, LogOut, BookOpen, Settings } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const { user, loading, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const handleLogoClick = () => {
        if (location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/');
        }
    };


    return (
        <>
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="container navbar-container">
                    <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                        VideoMaster
                    </div>

                    <div className="desktop-menu">
                        <Link to="/urunler" className="nav-link">Ürünler</Link>
                        <Link to="/icerik-uretimi" className="nav-link">İçerik Üretimi</Link>

                        {loading ? (
                            <span className="nav-link" style={{ opacity: 0.5 }}>...</span>
                        ) : isAuthenticated ? (
                            <div className="profile-dropdown" ref={profileRef}>
                                <button
                                    className="profile-btn"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                >
                                    <div className="profile-avatar">
                                        {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="profile-name">{user?.full_name?.split(' ')[0] || 'Hesabım'}</span>
                                </button>

                                {isProfileOpen && (
                                    <div className="dropdown-menu">
                                        <div className="dropdown-header">
                                            <div className="dropdown-avatar">
                                                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                            <div className="dropdown-info">
                                                <div className="dropdown-name">{user?.full_name || 'Kullanıcı'}</div>
                                                <div className="dropdown-email">{user?.email}</div>
                                            </div>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <Link to="/dashboard" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                                            <BookOpen size={18} />
                                            <span>Kurslarım</span>
                                        </Link>
                                        <Link to="/profil" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                                            <User size={18} />
                                            <span>Profilim</span>
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item logout" onClick={handleLogout}>
                                            <LogOut size={18} />
                                            <span>Çıkış Yap</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/giris" className="nav-link">Giriş Yap</Link>
                                <Link to="/kayit" className="btn btn-primary btn-sm">
                                    Kayıt Ol
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-content">
                    <Link to="/urunler" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Ürünler</Link>
                    <Link to="/icerik-uretimi" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>İçerik Üretimi</Link>

                    {isAuthenticated ? (
                        <>
                            <div className="mobile-profile-section">
                                <div className="mobile-profile-avatar">
                                    {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div className="mobile-profile-name">{user?.full_name || 'Kullanıcı'}</div>
                            </div>
                            <Link to="/dashboard" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Kurslarım</Link>
                            <Link to="/profil" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Profilim</Link>
                            <button className="mobile-nav-link mobile-logout" onClick={handleLogout}>Çıkış Yap</button>
                        </>
                    ) : (
                        <>
                            <Link to="/giris" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Giriş Yap</Link>
                            <Link to="/kayit" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Kayıt Ol</Link>
                        </>
                    )}
                </div>
            </div>

            <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          padding: 1.5rem 0;
          transition: all 0.3s ease;
        }

        .navbar.scrolled {
          background: rgba(10, 10, 10, 0.8);
          backdrop-filter: blur(10px);
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.5rem;
          background: linear-gradient(to right, var(--color-primary), var(--color-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .desktop-menu {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          color: var(--color-text-muted);
          font-weight: 500;
          transition: color 0.2s;
          font-size: 1rem;
        }

        .nav-link:hover {
          color: var(--color-text);
        }

        .btn-sm {
          padding: 0.5rem 1.5rem;
          font-size: 0.9rem;
        }

        .mobile-menu-btn {
          display: none;
          color: var(--color-text);
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: var(--color-bg);
          z-index: 999;
          transform: translateY(-100%);
          transition: transform 0.3s ease;
          padding-top: 80px;
        }

        .mobile-menu.open {
          transform: translateY(0);
        }

        .mobile-menu-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .mobile-nav-link {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-text);
        }

        /* Profile Dropdown Styles */
        .profile-dropdown {
          position: relative;
        }

        .profile-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.8rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 2rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .profile-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          color: #000;
        }

        .profile-name {
          color: var(--color-text);
          font-weight: 500;
          font-size: 0.9rem;
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          min-width: 280px;
          background: rgba(20, 20, 20, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 0.5rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          z-index: 1001;
          animation: dropdownFadeIn 0.2s ease;
        }

        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
        }

        .dropdown-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.2rem;
          color: #000;
        }

        .dropdown-info {
          flex: 1;
          overflow: hidden;
        }

        .dropdown-name {
          font-weight: 600;
          color: var(--color-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dropdown-email {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dropdown-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 0.5rem 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem;
          color: var(--color-text-muted);
          border-radius: 0.5rem;
          transition: all 0.2s;
          text-decoration: none;
          font-size: 0.95rem;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-text);
        }

        .dropdown-item.logout {
          color: #ff4757;
        }

        .dropdown-item.logout:hover {
          background: rgba(255, 71, 87, 0.1);
          color: #ff4757;
        }

        /* Mobile Profile Styles */
        .mobile-profile-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 1.5rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin: 1rem 0;
        }

        .mobile-profile-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.5rem;
          color: #000;
        }

        .mobile-profile-name {
          font-weight: 600;
          font-size: 1.2rem;
          color: var(--color-text);
        }

        .mobile-logout {
          color: #ff4757 !important;
        }

        @media (max-width: 768px) {
          .desktop-menu {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }
        }
      `}</style>
        </>
    );
};
