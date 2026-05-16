import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useSiteConfig } from '../hooks/useSiteConfig';

export const Navbar = () => {
    const config = useSiteConfig();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const whatsappUrl = `https://wa.me/${config.contact.whatsapp}`;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        setIsMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="container navbar-container">
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="logo">
                        {config.brand.name}
                        {config.brand.tagline && <span className="logo-tag">{config.brand.tagline}</span>}
                    </button>

                    <div className="desktop-menu">
                        <button onClick={() => scrollToSection('products')} className="nav-link">Ürünler</button>
                        <button onClick={() => scrollToSection('instructor')} className="nav-link">Ben Kimim</button>
                        <button onClick={() => scrollToSection('contact')} className="nav-link">İletişim</button>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm"
                        >
                            Kayıt Ol
                        </a>
                    </div>

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Menü"
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-content">
                    <button onClick={() => scrollToSection('products')} className="mobile-nav-link">Ürünler</button>
                    <button onClick={() => scrollToSection('instructor')} className="mobile-nav-link">Ben Kimim</button>
                    <button onClick={() => scrollToSection('contact')} className="mobile-nav-link">İletişim</button>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Kayıt Ol
                    </a>
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
          display: inline-flex;
          align-items: baseline;
          gap: 0.4rem;
        }

        .logo-tag {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--color-text-muted);
          background: none;
          -webkit-text-fill-color: var(--color-text-muted);
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
          padding: 0 2rem;
        }

        .mobile-nav-link {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-text);
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
