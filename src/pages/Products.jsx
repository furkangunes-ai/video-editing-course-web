import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Play, Users, Clock, CheckCircle, Calendar, MessageCircle, Video, Star, ArrowRight, Zap, Shield, Sparkles, Award, Radio } from 'lucide-react';

export const Products = () => {
    const [hoveredCard, setHoveredCard] = useState(null);

    return (
        <>
            <Navbar />
            <div className="products-page">
                {/* Animated Background */}
                <div className="bg-gradient"></div>
                <div className="bg-grid"></div>

                <div className="products-container">
                    {/* Hero Section */}
                    <div className="products-hero">
                        <div className="hero-badge">
                            <Sparkles size={14} />
                            <span>Video Editörlük Eğitimi</span>
                        </div>
                        <h1 className="products-title">
                            Kariyerini <span className="highlight">Dönüştür</span>
                        </h1>
                        <p className="products-subtitle">
                            Profesyonel video editör olma yolculuğunda sana özel eğitim ve mentorluk programları
                        </p>
                    </div>

                    {/* Products Grid - 3 Columns */}
                    <div className="products-grid three-cols">
                        {/* Kurs Kartı - Normal */}
                        <div
                            className={`product-card ${hoveredCard === 'course' ? 'hovered' : ''}`}
                            onMouseEnter={() => setHoveredCard('course')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="card-glow green-glow"></div>
                            <div className="card-content">
                                <div className="card-header">
                                    <div className="badge-row">
                                        <span className="product-badge popular">
                                            <Star size={12} />
                                            En Popüler
                                        </span>
                                        <span className="discount-badge">%83 İNDİRİM</span>
                                    </div>

                                    <div className="product-icon">
                                        <Play size={28} />
                                    </div>

                                    <h2 className="product-title">Video Editörlüğü Ustalık Sınıfı</h2>
                                    <p className="product-tagline">Sıfırdan profesyonele, tek kurs</p>
                                </div>

                                <div className="price-section">
                                    <div className="price-wrapper">
                                        <span className="old-price">₺1.199</span>
                                        <div className="current-price-row">
                                            <span className="current-price">₺199</span>
                                            <span className="price-period">tek seferlik</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="features-grid">
                                    <div className="feature-item">
                                        <div className="feature-icon">
                                            <Video size={16} />
                                        </div>
                                        <span>90+ Video</span>
                                    </div>
                                    <div className="feature-item">
                                        <div className="feature-icon">
                                            <Clock size={16} />
                                        </div>
                                        <span>Ömür Boyu Erişim</span>
                                    </div>
                                    <div className="feature-item">
                                        <div className="feature-icon">
                                            <Shield size={16} />
                                        </div>
                                        <span>3 Gün Garanti</span>
                                    </div>
                                    <div className="feature-item">
                                        <div className="feature-icon">
                                            <CheckCircle size={16} />
                                        </div>
                                        <span>Sertifika</span>
                                    </div>
                                </div>

                                <div className="divider"></div>

                                <ul className="benefits-list">
                                    <li>
                                        <CheckCircle size={16} />
                                        <span>Tüm Eğitim Modülleri (90+ Video)</span>
                                    </li>
                                    <li>
                                        <CheckCircle size={16} />
                                        <span>Premiere Pro Eğitimi</span>
                                    </li>
                                    <li>
                                        <CheckCircle size={16} />
                                        <span>Müşteri Bulma Rehberi (Bonus)</span>
                                    </li>
                                    <li>
                                        <CheckCircle size={16} />
                                        <span>Temel Düzenleme Teknikleri</span>
                                    </li>
                                </ul>

                                <Link
                                    to="/satin-al"
                                    className="cta-button primary"
                                >
                                    <span>Hemen Satın Al</span>
                                    <ArrowRight size={18} />
                                </Link>

                                <p className="guarantee-text">
                                    <Shield size={14} />
                                    3 Gün Para İade Garantisi
                                </p>
                            </div>
                        </div>

                        {/* Canlı Eğitim Kartı - Yeni */}
                        <div
                            className={`product-card live-card ${hoveredCard === 'live' ? 'hovered' : ''}`}
                            onMouseEnter={() => setHoveredCard('live')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="card-glow amber-glow"></div>
                            <div className="card-content">
                                <div className="card-header">
                                    <div className="badge-row">
                                        <span className="product-badge live-badge">
                                            <Radio size={12} />
                                            Canlı Eğitim
                                        </span>
                                        <span className="discount-badge">%25 İNDİRİM</span>
                                    </div>

                                    <div className="product-icon live-icon">
                                        <Video size={28} />
                                    </div>

                                    <h2 className="product-title">Canlı Video Editörlük Eğitimi</h2>
                                    <p className="product-tagline">4 Seans interaktif eğitim</p>
                                </div>

                                <div className="price-section live-price-section">
                                    <div className="price-wrapper">
                                        <span className="old-price">₺1.199</span>
                                        <div className="current-price-row">
                                            <span className="current-price live-price">₺899</span>
                                            <span className="price-period">4 seans</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="features-grid">
                                    <div className="feature-item live-feature">
                                        <div className="feature-icon live-icon-sm">
                                            <Calendar size={16} />
                                        </div>
                                        <span>4 Canlı Seans</span>
                                    </div>
                                    <div className="feature-item live-feature">
                                        <div className="feature-icon live-icon-sm">
                                            <MessageCircle size={16} />
                                        </div>
                                        <span>WhatsApp Destek</span>
                                    </div>
                                    <div className="feature-item live-feature">
                                        <div className="feature-icon live-icon-sm">
                                            <Zap size={16} />
                                        </div>
                                        <span>Anlık Soru-Cevap</span>
                                    </div>
                                    <div className="feature-item live-feature">
                                        <div className="feature-icon live-icon-sm">
                                            <Video size={16} />
                                        </div>
                                        <span>Kayıt Erişimi</span>
                                    </div>
                                </div>

                                <div className="divider live-divider"></div>

                                <ul className="benefits-list live-list">
                                    <li>
                                        <CheckCircle size={16} />
                                        <span>Haftalık 2 Saat Canlı Ders</span>
                                    </li>
                                    <li>
                                        <CheckCircle size={16} />
                                        <span>Özel WhatsApp Destek Grubu</span>
                                    </li>
                                    <li>
                                        <CheckCircle size={16} />
                                        <span>Birebir Geri Bildirim</span>
                                    </li>
                                    <li>
                                        <CheckCircle size={16} />
                                        <span>Tüm Kayıtlara Ömür Boyu Erişim</span>
                                    </li>
                                </ul>

                                <Link
                                    to="/satin-al?kurs=canli-egitim"
                                    className="cta-button live-cta"
                                >
                                    <span>Hemen Satın Al</span>
                                    <ArrowRight size={18} />
                                </Link>

                                <p className="limited-spots live-spots">
                                    <Sparkles size={14} />
                                    Sınırlı kontenjan - Sadece 10 kişi
                                </p>
                            </div>
                        </div>

                        {/* Danışmanlık Kartı */}
                        <div
                            className={`product-card premium-card ${hoveredCard === 'consulting' ? 'hovered' : ''}`}
                            onMouseEnter={() => setHoveredCard('consulting')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="card-glow purple-glow"></div>
                            <div className="card-content">
                                <div className="card-header">
                                    <div className="badge-row">
                                        <span className="product-badge premium">
                                            <Award size={12} />
                                            Premium
                                        </span>
                                    </div>

                                    <div className="product-icon premium-icon">
                                        <Users size={28} />
                                    </div>

                                    <h2 className="product-title">Bireysel Danışmanlık</h2>
                                    <p className="product-tagline">Birebir mentorluk deneyimi</p>
                                </div>

                                <div className="price-section premium-price-section">
                                    <p className="contact-for-price">Ücret bilgisi için iletişime geçin</p>
                                </div>

                                <div className="features-grid">
                                    <div className="feature-item premium-feature">
                                        <div className="feature-icon premium-icon-sm">
                                            <Calendar size={16} />
                                        </div>
                                        <span>Haftalık Görüşme</span>
                                    </div>
                                    <div className="feature-item premium-feature">
                                        <div className="feature-icon premium-icon-sm">
                                            <MessageCircle size={16} />
                                        </div>
                                        <span>7/24 Destek</span>
                                    </div>
                                    <div className="feature-item premium-feature">
                                        <div className="feature-icon premium-icon-sm">
                                            <Zap size={16} />
                                        </div>
                                        <span>Hızlı İlerleme</span>
                                    </div>
                                    <div className="feature-item premium-feature">
                                        <div className="feature-icon premium-icon-sm">
                                            <Award size={16} />
                                        </div>
                                        <span>Özel İçerik</span>
                                    </div>
                                </div>

                                <div className="divider premium-divider"></div>

                                <ul className="benefits-list premium-list">
                                    <li>
                                        <CheckCircle size={16} />
                                        <span>Haftalık 1 Saat Birebir Görüşme</span>
                                    </li>
                                    <li>
                                        <CheckCircle size={16} />
                                        <span>Kişisel Gelişim Planı</span>
                                    </li>
                                    <li>
                                        <CheckCircle size={16} />
                                        <span>Proje Bazlı Mentörlük</span>
                                    </li>
                                    <li>
                                        <CheckCircle size={16} />
                                        <span>Portföy ve Kariyer Danışmanlığı</span>
                                    </li>
                                </ul>

                                <a
                                    href="https://wa.me/905011411940?text=Merhaba,%20Bireysel%20Danışmanlık%20hizmeti%20hakkında%20bilgi%20almak%20istiyorum."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cta-button premium-cta"
                                >
                                    <span>İletişime Geç</span>
                                    <MessageCircle size={18} />
                                </a>

                                <p className="limited-spots">
                                    <Sparkles size={14} />
                                    Sınırlı kontenjan - Sadece 3 kişi
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Comparison Section - 3 Cards */}
                    <div className="comparison-section">
                        <h3 className="comparison-title">Hangisi Sana Uygun?</h3>
                        <div className="comparison-cards three-cols">
                            <div className="comparison-card">
                                <div className="comparison-icon green">
                                    <Play size={24} />
                                </div>
                                <h4>Ustalık Sınıfı</h4>
                                <p>Kendi hızında öğrenmek, temel ve ileri teknikleri kapsamlı şekilde kavramak istiyorsan.</p>
                                <ul>
                                    <li>Yeni başlayanlar için ideal</li>
                                    <li>Esnek çalışma imkanı</li>
                                    <li>Tek seferlik yatırım</li>
                                </ul>
                            </div>
                            <div className="comparison-card">
                                <div className="comparison-icon amber">
                                    <Video size={24} />
                                </div>
                                <h4>Canlı Eğitim</h4>
                                <p>Interaktif öğrenme, anlık sorular ve grup dinamiği ile daha hızlı ilerleme istiyorsan.</p>
                                <ul>
                                    <li>Canlı soru-cevap imkanı</li>
                                    <li>WhatsApp destek grubu</li>
                                    <li>Grup motivasyonu</li>
                                </ul>
                            </div>
                            <div className="comparison-card">
                                <div className="comparison-icon purple">
                                    <Users size={24} />
                                </div>
                                <h4>Bireysel Danışmanlık</h4>
                                <p>Hızlı ilerleme, özel projelerinde destek ve kariyer odaklı çalışmak istiyorsan.</p>
                                <ul>
                                    <li>Deneyimli profesyoneller için</li>
                                    <li>Kişiselleştirilmiş içerik</li>
                                    <li>Doğrudan mentorluk</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="trust-section">
                        <div className="trust-item">
                            <Shield size={24} />
                            <span>3 Gün Para İade Garantisi</span>
                        </div>
                        <div className="trust-item">
                            <Clock size={24} />
                            <span>Ömür Boyu Erişim</span>
                        </div>
                        <div className="trust-item">
                            <MessageCircle size={24} />
                            <span>WhatsApp Destek</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .products-page {
                    min-height: 100vh;
                    padding-top: 100px;
                    padding-bottom: 6rem;
                    background: #0a0a0a;
                    position: relative;
                    overflow: hidden;
                }

                .bg-gradient {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 100%;
                    height: 600px;
                    background: radial-gradient(ellipse at center top, rgba(0, 255, 157, 0.08) 0%, transparent 60%),
                                radial-gradient(ellipse at 20% 50%, rgba(112, 0, 255, 0.06) 0%, transparent 50%),
                                radial-gradient(ellipse at 80% 30%, rgba(255, 170, 0, 0.05) 0%, transparent 40%);
                    pointer-events: none;
                }

                .bg-grid {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 60px 60px;
                    pointer-events: none;
                }

                .products-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                    position: relative;
                    z-index: 1;
                }

                /* Hero Section */
                .products-hero {
                    text-align: center;
                    margin-bottom: 4rem;
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: rgba(0, 255, 157, 0.1);
                    border: 1px solid rgba(0, 255, 157, 0.2);
                    border-radius: 2rem;
                    color: #00ff9d;
                    font-size: 0.85rem;
                    font-weight: 500;
                    margin-bottom: 1.5rem;
                }

                .products-title {
                    font-size: clamp(2.5rem, 5vw, 4rem);
                    font-weight: 800;
                    color: #fff;
                    margin-bottom: 1rem;
                    letter-spacing: -0.02em;
                }

                .products-title .highlight {
                    background: linear-gradient(135deg, #00ff9d 0%, #ffaa00 50%, #7000ff 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .products-subtitle {
                    font-size: 1.2rem;
                    color: #a0a0a0;
                    max-width: 600px;
                    margin: 0 auto;
                    line-height: 1.6;
                }

                /* Products Grid - 3 Columns */
                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 2rem;
                    margin-bottom: 5rem;
                }

                .products-grid.three-cols {
                    grid-template-columns: repeat(3, 1fr);
                }

                /* Product Card */
                .product-card {
                    position: relative;
                    background: linear-gradient(180deg, rgba(30, 30, 30, 0.8) 0%, rgba(15, 15, 15, 0.9) 100%);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1.5rem;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .product-card:hover {
                    transform: translateY(-8px);
                    border-color: rgba(0, 255, 157, 0.3);
                }

                .live-card:hover {
                    border-color: rgba(255, 170, 0, 0.4);
                }

                .premium-card:hover {
                    border-color: rgba(112, 0, 255, 0.4);
                }

                .card-glow {
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    opacity: 0;
                    transition: opacity 0.4s;
                    pointer-events: none;
                }

                .green-glow {
                    background: radial-gradient(circle at center, rgba(0, 255, 157, 0.15) 0%, transparent 50%);
                }

                .amber-glow {
                    background: radial-gradient(circle at center, rgba(255, 170, 0, 0.18) 0%, transparent 50%);
                }

                .purple-glow {
                    background: radial-gradient(circle at center, rgba(112, 0, 255, 0.2) 0%, transparent 50%);
                }

                .product-card:hover .card-glow {
                    opacity: 1;
                }

                .card-content {
                    position: relative;
                    padding: 2rem;
                    z-index: 1;
                    display: grid;
                    grid-template-rows: auto auto auto auto auto auto;
                    gap: 1.25rem;
                    height: 100%;
                }

                .card-header {
                    text-align: center;
                }

                .badge-row {
                    display: flex;
                    justify-content: center;
                    gap: 0.75rem;
                    margin-bottom: 1.25rem;
                    flex-wrap: wrap;
                }

                .product-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    padding: 0.4rem 0.8rem;
                    border-radius: 2rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .product-badge.popular {
                    background: linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%);
                    color: #000;
                }

                .product-badge.live-badge {
                    background: linear-gradient(135deg, #ffaa00 0%, #ff8800 100%);
                    color: #000;
                }

                .product-badge.premium {
                    background: linear-gradient(135deg, #7000ff 0%, #9b4dff 100%);
                    color: #fff;
                }

                .discount-badge {
                    background: #ff4757;
                    color: #fff;
                    padding: 0.4rem 0.8rem;
                    border-radius: 2rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                }

                .product-icon {
                    width: 70px;
                    height: 70px;
                    margin: 0 auto 1rem;
                    border-radius: 1.25rem;
                    background: linear-gradient(135deg, rgba(0, 255, 157, 0.15) 0%, rgba(0, 255, 157, 0.05) 100%);
                    border: 1px solid rgba(0, 255, 157, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #00ff9d;
                }

                .product-icon.live-icon {
                    background: linear-gradient(135deg, rgba(255, 170, 0, 0.2) 0%, rgba(255, 136, 0, 0.1) 100%);
                    border-color: rgba(255, 170, 0, 0.3);
                    color: #ffaa00;
                }

                .product-icon.premium-icon {
                    background: linear-gradient(135deg, rgba(112, 0, 255, 0.2) 0%, rgba(155, 77, 255, 0.1) 100%);
                    border-color: rgba(112, 0, 255, 0.3);
                    color: #9b4dff;
                }

                .product-title {
                    font-size: 1.35rem;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 0.4rem;
                }

                .product-tagline {
                    color: #a0a0a0;
                    font-size: 0.9rem;
                }

                /* Price Section */
                .price-section {
                    text-align: center;
                    padding: 1.25rem;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 1rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .old-price {
                    font-size: 1rem;
                    color: #666;
                    text-decoration: line-through;
                    display: block;
                    margin-bottom: 0.25rem;
                }

                .current-price-row {
                    display: flex;
                    align-items: baseline;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .current-price {
                    font-size: 2.5rem;
                    font-weight: 800;
                    background: linear-gradient(180deg, #fff 0%, #00ff9d 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .current-price.live-price {
                    background: linear-gradient(180deg, #fff 0%, #ffaa00 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .premium-price {
                    background: linear-gradient(180deg, #fff 0%, #9b4dff 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .price-period {
                    font-size: 0.9rem;
                    color: #666;
                }

                .premium-price-section {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .contact-for-price {
                    font-size: 1rem;
                    color: #9b4dff;
                    font-weight: 600;
                    margin: 0;
                }

                /* Features Grid */
                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.6rem;
                    align-content: start;
                }

                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.5rem 0.6rem;
                    background: rgba(0, 255, 157, 0.05);
                    border: 1px solid rgba(0, 255, 157, 0.1);
                    border-radius: 0.5rem;
                    font-size: 0.8rem;
                    color: #ccc;
                }

                .live-feature {
                    background: rgba(255, 170, 0, 0.08);
                    border-color: rgba(255, 170, 0, 0.15);
                }

                .premium-feature {
                    background: rgba(112, 0, 255, 0.08);
                    border-color: rgba(112, 0, 255, 0.15);
                }

                .feature-icon {
                    width: 26px;
                    height: 26px;
                    border-radius: 0.4rem;
                    background: rgba(0, 255, 157, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #00ff9d;
                    flex-shrink: 0;
                }

                .feature-icon.live-icon-sm {
                    background: rgba(255, 170, 0, 0.15);
                    color: #ffaa00;
                }

                .premium-icon-sm {
                    background: rgba(112, 0, 255, 0.15);
                    color: #9b4dff;
                }

                .divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(0, 255, 157, 0.2), transparent);
                }

                .live-divider {
                    background: linear-gradient(90deg, transparent, rgba(255, 170, 0, 0.25), transparent);
                }

                .premium-divider {
                    background: linear-gradient(90deg, transparent, rgba(112, 0, 255, 0.3), transparent);
                }

                /* Benefits List */
                .benefits-list {
                    list-style: none;
                }

                .benefits-list li {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    padding: 0.5rem 0;
                    color: #ccc;
                    font-size: 0.9rem;
                }

                .benefits-list li svg {
                    color: #00ff9d;
                    flex-shrink: 0;
                }

                .live-list li svg {
                    color: #ffaa00;
                }

                .premium-list li svg {
                    color: #9b4dff;
                }

                /* CTA Button */
                .cta-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    width: 100%;
                    padding: 1rem 1.5rem;
                    border-radius: 0.75rem;
                    font-size: 1rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .cta-button.primary {
                    background: linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%);
                    color: #000;
                    box-shadow: 0 4px 20px rgba(0, 255, 157, 0.3);
                }

                .cta-button.primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(0, 255, 157, 0.4);
                }

                .cta-button.live-cta {
                    background: linear-gradient(135deg, #ffaa00 0%, #ff8800 100%);
                    color: #000;
                    box-shadow: 0 4px 20px rgba(255, 170, 0, 0.3);
                }

                .cta-button.live-cta:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(255, 170, 0, 0.4);
                }

                .cta-button.premium-cta {
                    background: linear-gradient(135deg, #7000ff 0%, #9b4dff 100%);
                    color: #fff;
                    box-shadow: 0 4px 20px rgba(112, 0, 255, 0.3);
                }

                .cta-button.premium-cta:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(112, 0, 255, 0.4);
                }

                .guarantee-text, .limited-spots {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    color: #666;
                    text-align: center;
                }

                .limited-spots {
                    color: #9b4dff;
                }

                .live-spots {
                    color: #ffaa00;
                }

                /* Comparison Section */
                .comparison-section {
                    margin-bottom: 4rem;
                }

                .comparison-title {
                    text-align: center;
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 2rem;
                }

                .comparison-cards {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                }

                .comparison-cards.three-cols {
                    grid-template-columns: repeat(3, 1fr);
                }

                .comparison-card {
                    background: rgba(20, 20, 20, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    transition: all 0.3s ease;
                }

                .comparison-card:hover {
                    border-color: rgba(255, 255, 255, 0.15);
                }

                .comparison-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1rem;
                }

                .comparison-icon.green {
                    background: rgba(0, 255, 157, 0.1);
                    color: #00ff9d;
                }

                .comparison-icon.amber {
                    background: rgba(255, 170, 0, 0.12);
                    color: #ffaa00;
                }

                .comparison-icon.purple {
                    background: rgba(112, 0, 255, 0.15);
                    color: #9b4dff;
                }

                .comparison-card h4 {
                    font-size: 1.1rem;
                    color: #fff;
                    margin-bottom: 0.5rem;
                }

                .comparison-card p {
                    font-size: 0.85rem;
                    color: #888;
                    line-height: 1.5;
                    margin-bottom: 0.75rem;
                }

                .comparison-card ul {
                    list-style: none;
                }

                .comparison-card li {
                    position: relative;
                    padding-left: 1.25rem;
                    color: #aaa;
                    font-size: 0.85rem;
                    margin-bottom: 0.4rem;
                }

                .comparison-card li::before {
                    content: "→";
                    position: absolute;
                    left: 0;
                    color: #00ff9d;
                }

                .comparison-card:nth-child(2) li::before {
                    color: #ffaa00;
                }

                .comparison-card:nth-child(3) li::before {
                    color: #9b4dff;
                }

                /* Trust Section */
                .trust-section {
                    display: flex;
                    justify-content: center;
                    gap: 3rem;
                    padding: 2rem;
                    background: rgba(20, 20, 20, 0.5);
                    border-radius: 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .trust-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: #888;
                    font-size: 0.9rem;
                }

                .trust-item svg {
                    color: #00ff9d;
                }

                /* Responsive */
                @media (max-width: 1100px) {
                    .products-grid.three-cols {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }

                    .comparison-cards.three-cols {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 900px) {
                    .products-grid {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }

                    .comparison-cards {
                        grid-template-columns: 1fr;
                    }

                    .trust-section {
                        flex-direction: column;
                        align-items: center;
                        gap: 1rem;
                    }
                }

                @media (max-width: 600px) {
                    .products-hero {
                        margin-bottom: 2.5rem;
                    }

                    .card-content {
                        padding: 1.25rem;
                        grid-template-rows: auto auto auto auto auto auto;
                    }

                    .features-grid {
                        grid-template-columns: 1fr;
                    }

                    .current-price {
                        font-size: 2rem;
                    }

                    .comparison-card {
                        padding: 1.25rem;
                    }
                }
            `}</style>
        </>
    );
};
