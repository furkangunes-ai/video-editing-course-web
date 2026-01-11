import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, CreditCard, Lock, CheckCircle, Loader2, User, Mail, ArrowRight, RefreshCw } from 'lucide-react';
import { trackCheckoutStart, trackEmailVerified, trackPaymentStart, trackError, setTag } from '../utils/clarity';

const API_BASE_URL = 'https://videomaster-backend-production.up.railway.app';

export const Checkout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [step, setStep] = useState(1); // 1: Form, 2: Doğrulama, 3: Ödeme
    const [verificationCode, setVerificationCode] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [countdown, setCountdown] = useState(0);
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

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
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

    const handleSendVerification = async () => {
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        // Clarity: Checkout başladı
        trackCheckoutStart('Video Editörlüğü Ustalık Sınıfı', 199);
        setTag('checkout_email', formData.email);

        try {
            const response = await fetch(`${API_BASE_URL}/api/payment/send-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    name: formData.name,
                    surname: formData.surname
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = typeof errorData.detail === 'string'
                    ? errorData.detail
                    : (errorData.detail?.msg || errorData.message || 'Doğrulama kodu gönderilemedi');
                throw new Error(errorMessage);
            }

            setStep(2);
            setCountdown(300); // 5 dakika
        } catch (err) {
            const message = err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.';
            setError(typeof message === 'string' ? message : 'Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        setError('');

        if (!verificationCode || verificationCode.length !== 6) {
            setError('Lütfen 6 haneli doğrulama kodunu girin');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/payment/verify-email-code?email=${encodeURIComponent(formData.email)}&code=${verificationCode}`, {
                method: 'POST',
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = typeof errorData.detail === 'string'
                    ? errorData.detail
                    : (errorData.detail?.msg || errorData.message || 'Doğrulama başarısız');
                throw new Error(errorMessage);
            }

            setIsEmailVerified(true);
            setStep(3);
            // Clarity: Email doğrulandı
            trackEmailVerified();
        } catch (err) {
            const message = err.message || 'Doğrulama kodu hatalı';
            setError(typeof message === 'string' ? message : 'Doğrulama kodu hatalı');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        setError('');
        setLoading(true);
        // Clarity: Ödeme başlatıldı
        trackPaymentStart();

        try {
            const response = await fetch(`${API_BASE_URL}/api/payment/create-guest-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    buyer_name: formData.name,
                    buyer_surname: formData.surname,
                    buyer_email: formData.email,
                    verification_code: verificationCode,
                    product_id: 'ustalık-sinifi'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = typeof errorData.detail === 'string'
                    ? errorData.detail
                    : (errorData.detail?.msg || errorData.message || 'Sipariş oluşturulamadı');
                throw new Error(errorMessage);
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
            const message = err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.';
            setError(typeof message === 'string' ? message : 'Bir hata oluştu.');
            // Clarity: Hata oluştu
            trackError('payment_error', message);
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <>
            <Navbar />
            <div className="checkout-page">
                <div className="checkout-container">
                    {/* Adım Göstergesi */}
                    <div className="steps-indicator">
                        <div className={`step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                            <div className="step-number">{step > 1 ? <CheckCircle size={16} /> : '1'}</div>
                            <span>Bilgiler</span>
                        </div>
                        <div className="step-line"></div>
                        <div className={`step-item ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                            <div className="step-number">{step > 2 ? <CheckCircle size={16} /> : '2'}</div>
                            <span>Doğrulama</span>
                        </div>
                        <div className="step-line"></div>
                        <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
                            <div className="step-number">3</div>
                            <span>Ödeme</span>
                        </div>
                    </div>

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
                                    <span className="original-price">₺1.199</span>
                                </div>
                                <div className="price-row discount">
                                    <span>İndirim (%83)</span>
                                    <span>-₺1.000</span>
                                </div>
                                <div className="price-row total">
                                    <span>Toplam</span>
                                    <span className="final-price">₺199</span>
                                </div>
                            </div>

                            <div className="features-list">
                                <div className="feature">
                                    <CheckCircle size={16} />
                                    <span>7+ Saat & 90+ Video İçerik</span>
                                </div>
                                <div className="feature">
                                    <CheckCircle size={16} />
                                    <span>Ömür Boyu Erişim</span>
                                </div>
                                <div className="feature">
                                    <CheckCircle size={16} />
                                    <span>Sertifika</span>
                                </div>
                                <div className="feature">
                                    <CheckCircle size={16} />
                                    <span>3 Gün Para İade Garantisi</span>
                                </div>
                            </div>
                        </div>

                        {/* Sağ: Ödeme Formu */}
                        <div className="payment-section">
                            {/* Step 1: Form */}
                            {step === 1 && (
                                <>
                                    <h2>Bilgilerinizi Girin</h2>

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
                                            Email adresinizi doğruladıktan sonra ödeme adımına geçebilirsiniz.
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="error-message">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        className="pay-button"
                                        onClick={handleSendVerification}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="spinner" size={20} />
                                                Gönderiliyor...
                                            </>
                                        ) : (
                                            <>
                                                Doğrulama Kodu Gönder
                                                <ArrowRight size={20} />
                                            </>
                                        )}
                                    </button>
                                </>
                            )}

                            {/* Step 2: Doğrulama */}
                            {step === 2 && (
                                <>
                                    <h2>Email Doğrulama</h2>

                                    <div className="verification-info">
                                        <Mail size={24} />
                                        <p>
                                            <strong>{formData.email}</strong> adresine 6 haneli doğrulama kodu gönderdik.
                                        </p>
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <Lock size={16} />
                                            Doğrulama Kodu
                                        </label>
                                        <input
                                            type="text"
                                            value={verificationCode}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                setVerificationCode(value);
                                                setError('');
                                            }}
                                            placeholder="123456"
                                            maxLength={6}
                                            disabled={loading}
                                            className="verification-input"
                                        />
                                    </div>

                                    {countdown > 0 && (
                                        <p className="countdown-text">
                                            Kod geçerlilik süresi: <strong>{formatTime(countdown)}</strong>
                                        </p>
                                    )}

                                    {error && (
                                        <div className="error-message">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        className="pay-button"
                                        onClick={handleVerifyCode}
                                        disabled={loading || verificationCode.length !== 6}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="spinner" size={20} />
                                                Doğrulanıyor...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={20} />
                                                Kodu Doğrula
                                            </>
                                        )}
                                    </button>

                                    <button
                                        className="resend-button"
                                        onClick={handleSendVerification}
                                        disabled={loading || countdown > 240}
                                    >
                                        <RefreshCw size={16} />
                                        {countdown > 240 ? `Tekrar gönder (${formatTime(countdown - 240)})` : 'Kodu Tekrar Gönder'}
                                    </button>

                                    <button
                                        className="back-button"
                                        onClick={() => {
                                            setStep(1);
                                            setVerificationCode('');
                                            setError('');
                                        }}
                                    >
                                        ← Email adresini değiştir
                                    </button>
                                </>
                            )}

                            {/* Step 3: Ödeme */}
                            {step === 3 && (
                                <>
                                    <h2>Güvenli Ödeme</h2>

                                    <div className="verified-email">
                                        <CheckCircle size={20} />
                                        <span>{formData.email}</span>
                                        <span className="verified-badge">Doğrulandı</span>
                                    </div>

                                    <div className="user-info-summary">
                                        <p><strong>Ad Soyad:</strong> {formData.name} {formData.surname}</p>
                                        <p><strong>Email:</strong> {formData.email}</p>
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
                                                Güvenli Ödeme Yap - ₺199
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
                                </>
                            )}
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

                /* Steps Indicator */
                .steps-indicator {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 2rem;
                    gap: 0.5rem;
                }

                .step-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--color-text-muted);
                    font-size: 0.9rem;
                }

                .step-item.active {
                    color: #00ff9d;
                }

                .step-item.completed .step-number {
                    background: #00ff9d;
                    color: #000;
                }

                .step-number {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 0.85rem;
                }

                .step-item.active .step-number {
                    background: #00ff9d;
                    color: #000;
                }

                .step-line {
                    width: 40px;
                    height: 2px;
                    background: rgba(255, 255, 255, 0.1);
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

                /* Verification Info */
                .verification-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: rgba(0, 255, 157, 0.05);
                    border: 1px solid rgba(0, 255, 157, 0.1);
                    border-radius: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .verification-info svg {
                    color: #00ff9d;
                    flex-shrink: 0;
                }

                .verification-info p {
                    color: var(--color-text-muted);
                    font-size: 0.9rem;
                    margin: 0;
                }

                .verification-info strong {
                    color: var(--color-text);
                }

                .verification-input {
                    text-align: center;
                    font-size: 1.5rem !important;
                    letter-spacing: 0.5rem;
                    font-family: monospace;
                }

                .countdown-text {
                    text-align: center;
                    color: var(--color-text-muted);
                    font-size: 0.85rem;
                    margin-bottom: 1rem;
                }

                .countdown-text strong {
                    color: #00ff9d;
                }

                .resend-button {
                    width: 100%;
                    padding: 0.75rem;
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    color: var(--color-text-muted);
                    font-size: 0.9rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                    transition: all 0.3s ease;
                }

                .resend-button:hover:not(:disabled) {
                    border-color: #00ff9d;
                    color: #00ff9d;
                }

                .resend-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .back-button {
                    width: 100%;
                    padding: 0.75rem;
                    background: transparent;
                    border: none;
                    color: var(--color-text-muted);
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: color 0.3s ease;
                }

                .back-button:hover {
                    color: var(--color-text);
                }

                /* Verified Email */
                .verified-email {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    background: rgba(0, 255, 157, 0.1);
                    border: 1px solid rgba(0, 255, 157, 0.3);
                    border-radius: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .verified-email svg {
                    color: #00ff9d;
                }

                .verified-email span {
                    color: var(--color-text);
                }

                .verified-badge {
                    margin-left: auto;
                    background: #00ff9d;
                    color: #000;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .user-info-summary {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 0.5rem;
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                }

                .user-info-summary p {
                    color: var(--color-text-muted);
                    font-size: 0.9rem;
                    margin: 0.25rem 0;
                }

                .user-info-summary strong {
                    color: var(--color-text);
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

                    .steps-indicator {
                        font-size: 0.8rem;
                    }

                    .step-item span {
                        display: none;
                    }
                }
            `}</style>
        </>
    );
};
