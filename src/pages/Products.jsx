import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Play, Users, Clock, CheckCircle, Calendar, MessageCircle, Video, Star, ArrowRight } from 'lucide-react';

export const Products = () => {
    return (
        <>
            <Navbar />
            <div className="products-page">
                <div className="products-container">
                    <div className="products-header">
                        <h1 className="products-title">
                            <span className="text-gradient-primary">Ürünlerimiz</span>
                        </h1>
                        <p className="products-subtitle">
                            Video editörlük yolculuğunuzda size eşlik edecek eğitim ve danışmanlık hizmetleri
                        </p>
                    </div>

                    <div className="products-grid">
                        {/* Kurs Kartı */}
                        <div className="product-card course-card-product">
                            <div className="product-badge">En Popüler</div>
                            <div className="product-icon">
                                <Play size={32} />
                            </div>
                            <h2 className="product-title">Video Editörlüğü Ustalık Sınıfı</h2>
                            <p className="product-description">
                                Sıfırdan profesyonel seviyeye video editörlüğü öğrenin.
                                Premiere Pro eğitimi ve müşteri bulma rehberi dahil.
                            </p>

                            <div className="product-features">
                                <div className="feature-item">
                                    <Video size={18} />
                                    <span>7+ Saat İçerik</span>
                                </div>
                                <div className="feature-item">
                                    <Clock size={18} />
                                    <span>Ömür Boyu Erişim</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircle size={18} />
                                    <span>WhatsApp Destek</span>
                                </div>
                                <div className="feature-item">
                                    <Star size={18} />
                                    <span>%80 İndirim</span>
                                </div>
                            </div>

                            <div className="product-includes">
                                <h4>Kurs İçeriği:</h4>
                                <ul>
                                    <li>Tüm Eğitim Modülleri (7+ Saat)</li>
                                    <li>Premiere Pro Eğitimi</li>
                                    <li>Müşteri Bulma Rehberi (Bonus)</li>
                                    <li>Özel WhatsApp Destek Grubu</li>
                                    <li>30 Gün Para İade Garantisi</li>
                                </ul>
                            </div>

                            <div className="product-pricing">
                                <div className="price-original">₺5.000</div>
                                <div className="price-current">₺999</div>
                                <div className="price-note">Tek seferlik ödeme • Ömür boyu erişim</div>
                            </div>

                            <Link to="/kayit" className="product-btn btn-primary">
                                Kursa Başla
                                <ArrowRight size={18} />
                            </Link>
                        </div>

                        {/* Danışmanlık Kartı */}
                        <div className="product-card consulting-card">
                            <div className="product-badge premium-badge">Premium</div>
                            <div className="product-icon consulting-icon">
                                <Users size={32} />
                            </div>
                            <h2 className="product-title">Bireysel Danışmanlık</h2>
                            <p className="product-description">
                                Birebir mentorluk ile kariyer hedeflerinize ulaşın.
                                Kişiselleştirilmiş eğitim planı ve doğrudan destek.
                            </p>

                            <div className="product-features">
                                <div className="feature-item">
                                    <MessageCircle size={18} />
                                    <span>1-1 Görüşmeler</span>
                                </div>
                                <div className="feature-item">
                                    <Calendar size={18} />
                                    <span>Haftalık Seanslar</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircle size={18} />
                                    <span>7/24 Destek</span>
                                </div>
                                <div className="feature-item">
                                    <Star size={18} />
                                    <span>Özel İçerikler</span>
                                </div>
                            </div>

                            <div className="product-includes">
                                <h4>Danışmanlık Kapsamı:</h4>
                                <ul>
                                    <li>Haftalık 1 saat birebir görüşme</li>
                                    <li>Kişisel gelişim planı</li>
                                    <li>Proje bazlı mentörlük</li>
                                    <li>Portföy değerlendirmesi</li>
                                    <li>Kariyer danışmanlığı</li>
                                    <li>WhatsApp/Telegram desteği</li>
                                </ul>
                            </div>

                            <div className="product-pricing">
                                <div className="price-current consulting-price">₺10.000</div>
                                <div className="price-note">Aylık abonelik</div>
                            </div>

                            <a
                                href="https://wa.me/905551234567?text=Merhaba,%20bireysel%20danışmanlık%20hizmeti%20hakkında%20bilgi%20almak%20istiyorum."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="product-btn btn-consulting"
                            >
                                İletişime Geç
                                <MessageCircle size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Karşılaştırma Bölümü */}
                    <div className="comparison-section">
                        <h3 className="comparison-title">Hangisi Bana Uygun?</h3>
                        <div className="comparison-grid">
                            <div className="comparison-item">
                                <h4>Video Editörlüğü Kursu</h4>
                                <p>Kendi hızınızda öğrenmek istiyorsanız, temel ve ileri teknikleri kapsamlı şekilde öğrenmek için ideal.</p>
                                <ul>
                                    <li>Yeni başlayanlar için uygun</li>
                                    <li>Esnek çalışma imkanı</li>
                                    <li>Tek seferlik yatırım</li>
                                </ul>
                            </div>
                            <div className="comparison-item">
                                <h4>Bireysel Danışmanlık</h4>
                                <p>Hızlı ilerleme kaydetmek, özel projelerinizde destek almak ve kariyer odaklı çalışmak istiyorsanız tercih edin.</p>
                                <ul>
                                    <li>Deneyimli profesyoneller için</li>
                                    <li>Kişiselleştirilmiş içerik</li>
                                    <li>Doğrudan mentorluk</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .products-page {
                    min-height: 100vh;
                    padding-top: 100px;
                    padding-bottom: 4rem;
                    background: var(--color-bg);
                }

                .products-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                .products-header {
                    text-align: center;
                    margin-bottom: 4rem;
                }

                .products-title {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }

                .products-subtitle {
                    font-size: 1.2rem;
                    color: var(--color-text-muted);
                    max-width: 600px;
                    margin: 0 auto;
                }

                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 2rem;
                    margin-bottom: 4rem;
                }

                .product-card {
                    background: rgba(20, 20, 20, 0.8);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1.5rem;
                    padding: 2.5rem;
                    position: relative;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }

                .product-card:hover {
                    border-color: rgba(0, 255, 157, 0.3);
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }

                .product-badge {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    background: linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%);
                    color: #000;
                    padding: 0.4rem 1rem;
                    border-radius: 2rem;
                    font-size: 0.8rem;
                    font-weight: 600;
                }

                .premium-badge {
                    background: linear-gradient(135deg, #7000ff 0%, #9b4dff 100%);
                    color: #fff;
                }

                .product-icon {
                    width: 70px;
                    height: 70px;
                    border-radius: 1rem;
                    background: linear-gradient(135deg, rgba(0, 255, 157, 0.2) 0%, rgba(0, 204, 125, 0.1) 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--color-primary);
                    margin-bottom: 1.5rem;
                }

                .consulting-icon {
                    background: linear-gradient(135deg, rgba(112, 0, 255, 0.2) 0%, rgba(155, 77, 255, 0.1) 100%);
                    color: #9b4dff;
                }

                .product-title {
                    font-size: 1.75rem;
                    margin-bottom: 1rem;
                    color: var(--color-text);
                }

                .product-description {
                    color: var(--color-text-muted);
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
                }

                .product-features {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--color-text-muted);
                    font-size: 0.9rem;
                }

                .feature-item svg {
                    color: var(--color-primary);
                    flex-shrink: 0;
                }

                .consulting-card .feature-item svg {
                    color: #9b4dff;
                }

                .product-includes {
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 1rem;
                    padding: 1.25rem;
                    margin-bottom: 1.5rem;
                    flex-grow: 1;
                }

                .product-includes h4 {
                    font-size: 0.9rem;
                    color: var(--color-text);
                    margin-bottom: 0.75rem;
                }

                .product-includes ul {
                    list-style: none;
                }

                .product-includes li {
                    position: relative;
                    padding-left: 1.25rem;
                    margin-bottom: 0.5rem;
                    color: var(--color-text-muted);
                    font-size: 0.9rem;
                }

                .product-includes li::before {
                    content: "✓";
                    position: absolute;
                    left: 0;
                    color: var(--color-primary);
                }

                .consulting-card .product-includes li::before {
                    color: #9b4dff;
                }

                .product-pricing {
                    text-align: center;
                    margin-bottom: 1.5rem;
                    padding: 1rem 0;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .price-original {
                    font-size: 1.2rem;
                    color: var(--color-text-muted);
                    text-decoration: line-through;
                    margin-bottom: 0.25rem;
                }

                .price-current {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: var(--color-primary);
                }

                .consulting-price {
                    color: #9b4dff;
                }

                .price-note {
                    font-size: 0.9rem;
                    color: var(--color-text-muted);
                    margin-top: 0.25rem;
                }

                .product-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    width: 100%;
                    padding: 1rem 2rem;
                    border-radius: 2rem;
                    font-weight: 600;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    text-decoration: none;
                }

                .product-btn.btn-primary {
                    background: linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%);
                    color: #000;
                }

                .product-btn.btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(0, 255, 157, 0.3);
                }

                .btn-consulting {
                    background: linear-gradient(135deg, #7000ff 0%, #9b4dff 100%);
                    color: #fff;
                }

                .btn-consulting:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(112, 0, 255, 0.3);
                }

                /* Karşılaştırma Bölümü */
                .comparison-section {
                    background: rgba(20, 20, 20, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1.5rem;
                    padding: 3rem;
                }

                .comparison-title {
                    text-align: center;
                    font-size: 1.75rem;
                    margin-bottom: 2rem;
                    color: var(--color-text);
                }

                .comparison-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 2rem;
                }

                .comparison-item {
                    padding: 1.5rem;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 1rem;
                }

                .comparison-item h4 {
                    font-size: 1.2rem;
                    margin-bottom: 0.75rem;
                    color: var(--color-primary);
                }

                .comparison-item:last-child h4 {
                    color: #9b4dff;
                }

                .comparison-item p {
                    color: var(--color-text-muted);
                    margin-bottom: 1rem;
                    font-size: 0.95rem;
                    line-height: 1.6;
                }

                .comparison-item ul {
                    list-style: none;
                }

                .comparison-item li {
                    padding-left: 1.25rem;
                    position: relative;
                    color: var(--color-text-muted);
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                }

                .comparison-item li::before {
                    content: "•";
                    position: absolute;
                    left: 0;
                    color: var(--color-primary);
                }

                .comparison-item:last-child li::before {
                    color: #9b4dff;
                }

                @media (max-width: 768px) {
                    .products-title {
                        font-size: 2rem;
                    }

                    .products-subtitle {
                        font-size: 1rem;
                    }

                    .products-grid {
                        grid-template-columns: 1fr;
                    }

                    .product-card {
                        padding: 1.5rem;
                    }

                    .product-features {
                        grid-template-columns: 1fr;
                    }

                    .comparison-grid {
                        grid-template-columns: 1fr;
                    }

                    .comparison-section {
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </>
    );
};
