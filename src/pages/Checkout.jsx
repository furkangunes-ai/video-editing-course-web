import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, CreditCard, Lock, CheckCircle, Loader2, User, Mail } from 'lucide-react';

const API_BASE_URL = 'https://videomaster-backend-production.up.railway.app';

export const Checkout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: ''
    });
    const formRef = useRef(null);
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Giriş yapmış kullanıcının bilgilerini form'a doldur
    useEffect(() => {
        if (user) {
            const nameParts = (user.full_name || '').split(' ');
            setFormData({
                name: nameParts[0] || '',
                surname: nameParts.slice(1).join(' ') || '',
                email: user.email || ''
            });
        }
    }, [user]);

    // Zaten erişimi varsa dashboard'a yönlendir
    useEffect(() => {
        if (user?.has_access) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Lütfen adınızı girin');
            return false;
        }
        if (!formData.surname.trim()) {
            setError('Lütfen soyadınızı girin');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Lütfen email adresinizi girin');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Geçerli bir email adresi girin');
            return false;
        }
        return true;
    };

    const handlePayment = async () => {
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Guest checkout için direkt Shopier'a form gönder
            const response = await fetch(`${API_BASE_URL}/api/payment/create-guest-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    buyer_name: formData.name,
                    buyer_surname: formData.surname,
                    buyer_email: formData.email,
                    product_id: 'ustalık-sinifi'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Sipariş oluşturulamadı');
            }

            const data = await response.json();
            setOrderData(data);

            // Form verisi hazır, otomatik submit
            setTimeout(() => {
                if (formRef.current) {
                    formRef.current.submit();
                }
            }, 500);
        } catch (err) {
            setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="checkout-page">
                <div className="checkout-container">
                    <div className="checkout-content">
                        {/* Sol: Ürün Bilgisi */}
                        <div className="product-summary">
                            <h2>Sipariş Özeti</h2>

                            <div className="product-card">
                                <div className="product-icon">
                                    <CreditCard size={32} />
                                </div>
                                <div className="product-info">
                                    <h3>Video Editörlüğü Ustalık Sınıfı</h3>
                                    <p>Sıfırdan profesyonele, tek kurs</p>
                                </div>
                            </div>

                            <div className="price-breakdown">
                                <div className="price-row">
                                    <span>Normal Fiyat</span>
                                    <span className="original-price">₺5.000</span>
                                </div>
                                <div className="price-row discount">
                                    <span>İndirim (%80)</span>
                                    <span>-₺4.001</span>
                                </div>
                                <div className="price-row total">
                                    <span>Toplam</span>
                                    <span className="final-price">₺999</span>
                                </div>
                            </div>

                            <div className="features-list">
                                <div className="feature">
                                    <CheckCircle size={16} />
                                    <span>7+ Saat Video İçerik</span>
                                </div>
                                <div className="feature">
                                    <CheckCircle size={16} />
                                    <span>Ömür Boyu Erişim</span>
                                </div>
                                <div className="feature">
                                    <CheckCircle size={16} />
                                    <span>WhatsApp Destek Grubu</span>
                                </div>
                                <div className="feature">
                                    <CheckCircle size={16} />
                                    <span>30 Gün Para İade Garantisi</span>
                                </div>
                            </div>
                        </div>

                        {/* Sağ: Ödeme Formu */}
                        <div className="payment-section">
                            <h2>Güvenli Ödeme</h2>

                            <div className="checkout-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>
                                            <User size={16} />
                                            Ad
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Adınız"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <User size={16} />
                                            Soyad
                                        </label>
                                        <input
                                            type="text"
                                            name="surname"
                                            value={formData.surname}
                                            onChange={handleInputChange}
                                            placeholder="Soyadınız"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>
                                        <Mail size={16} />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="ornek@email.com"
                                        disabled={loading}
                                    />
                                </div>

                                <p className="form-note">
                                    Kurs erişim bilgileri bu email adresine gönderilecektir.
                                </p>
                            </div>

                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}

                            <button
                                className="pay-button"
                                onClick={handlePayment}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="spinner" size={20} />
                                        Yönlendiriliyor...
                                    </>
                                ) : (
                                    <>
                                        <Lock size={20} />
                                        Güvenli Ödeme Yap - ₺999
                                    </>
                                )}
                            </button>

                            <div className="security-badges">
                                <div className="badge">
                                    <ShieldCheck size={20} />
                                    <span>256-bit SSL</span>
                                </div>
                                <div className="badge">
                                    <Lock size={20} />
                                    <span>Güvenli Ödeme</span>
                                </div>
                            </div>

                            <p className="payment-note">
                                Ödeme işlemi Shopier güvenli ödeme altyapısı üzerinden gerçekleştirilmektedir.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Shopier Form (Gizli) */}
                {orderData && (
                    <form
                        ref={formRef}
                        action={orderData.payment_url}
                        method="POST"
                        style={{ display: 'none' }}
                    >
                        {Object.entries(orderData.form_data).map(([key, value]) => (
                            <input key={key} type="hidden" name={key} value={value} />
                        ))}
                    </form>
                )}
            </div>

            <style>{`
                .checkout-page {
                    min-height: 100vh;
                    padding-top: 100px;
                    padding-bottom: 4rem;
                    background: var(--color-bg);
                }

                .checkout-container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }

                .checkout-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }

                .spinner {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                /* Sol: Ürün Özeti */
                .product-summary {
                    background: rgba(20, 20, 20, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1rem;
                    padding: 2rem;
                }

                .product-summary h2 {
                    color: var(--color-text);
                    margin-bottom: 1.5rem;
                    font-size: 1.25rem;
                }

                .product-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: rgba(0, 255, 157, 0.05);
                    border: 1px solid rgba(0, 255, 157, 0.1);
                    border-radius: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .product-icon {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, rgba(0, 255, 157, 0.2), rgba(0, 255, 157, 0.05));
                    border-radius: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #00ff9d;
                }

                .product-info h3 {
                    color: var(--color-text);
                    font-size: 1rem;
                    margin-bottom: 0.25rem;
                }

                .product-info p {
                    color: var(--color-text-muted);
                    font-size: 0.85rem;
                }

                .price-breakdown {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: 1rem;
                    margin-bottom: 1.5rem;
                }

                .price-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.5rem 0;
                    color: var(--color-text-muted);
                }

                .price-row.discount {
                    color: #00ff9d;
                }

                .price-row.total {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    margin-top: 0.5rem;
                    padding-top: 1rem;
                    font-weight: 700;
                    color: var(--color-text);
                }

                .original-price {
                    text-decoration: line-through;
                    color: #666;
                }

                .final-price {
                    font-size: 1.5rem;
                    color: #00ff9d;
                }

                .features-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .feature {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--color-text-muted);
                    font-size: 0.9rem;
                }

                .feature svg {
                    color: #00ff9d;
                }

                /* Sağ: Ödeme */
                .payment-section {
                    background: rgba(20, 20, 20, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1rem;
                    padding: 2rem;
                }

                .payment-section h2 {
                    color: var(--color-text);
                    margin-bottom: 1.5rem;
                    font-size: 1.25rem;
                }

                /* Form Styles */
                .checkout-form {
                    margin-bottom: 1.5rem;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .form-group {
                    margin-bottom: 1rem;
                }

                .form-group label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--color-text-muted);
                    font-size: 0.85rem;
                    margin-bottom: 0.5rem;
                }

                .form-group input {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    color: var(--color-text);
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .form-group input:focus {
                    outline: none;
                    border-color: #00ff9d;
                    background: rgba(0, 255, 157, 0.05);
                }

                .form-group input::placeholder {
                    color: rgba(255, 255, 255, 0.3);
                }

                .form-group input:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .form-note {
                    font-size: 0.8rem;
                    color: var(--color-text-muted);
                    margin-bottom: 1rem;
                }

                .error-message {
                    background: rgba(255, 71, 87, 0.1);
                    border: 1px solid rgba(255, 71, 87, 0.3);
                    color: #ff4757;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    margin-bottom: 1rem;
                    font-size: 0.9rem;
                }

                .pay-button {
                    width: 100%;
                    padding: 1rem 2rem;
                    background: linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%);
                    color: #000;
                    font-size: 1.1rem;
                    font-weight: 700;
                    border: none;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: all 0.3s ease;
                    margin-bottom: 1rem;
                }

                .pay-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(0, 255, 157, 0.4);
                }

                .pay-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .security-badges {
                    display: flex;
                    justify-content: center;
                    gap: 2rem;
                    margin-bottom: 1rem;
                }

                .badge {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--color-text-muted);
                    font-size: 0.8rem;
                }

                .badge svg {
                    color: #00ff9d;
                }

                .payment-note {
                    text-align: center;
                    color: var(--color-text-muted);
                    font-size: 0.75rem;
                }

                @media (max-width: 768px) {
                    .checkout-content {
                        grid-template-columns: 1fr;
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                    }

                    .checkout-container {
                        padding: 0 1rem;
                    }
                }
            `}</style>
        </>
    );
};
