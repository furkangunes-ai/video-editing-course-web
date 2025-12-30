import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { createOrder } from '../api/paymentApi';
import { ShieldCheck, CreditCard, Lock, CheckCircle, Loader2 } from 'lucide-react';

export const Checkout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderData, setOrderData] = useState(null);
    const formRef = useRef(null);
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/giris?redirect=/satin-al');
        }
    }, [authLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (user?.has_access) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handlePayment = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await createOrder('ustalık-sinifi');
            setOrderData(data);

            // Form verisi hazır, otomatik submit için timeout
            setTimeout(() => {
                if (formRef.current) {
                    formRef.current.submit();
                }
            }, 500);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="checkout-loading">
                <Loader2 className="spinner" size={40} />
                <p>Yükleniyor...</p>
            </div>
        );
    }

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

                        {/* Sağ: Ödeme Butonu */}
                        <div className="payment-section">
                            <h2>Güvenli Ödeme</h2>

                            <div className="user-info">
                                <p><strong>Hesap:</strong> {user?.email}</p>
                                <p><strong>Ad Soyad:</strong> {user?.full_name || 'Belirtilmemiş'}</p>
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
                .checkout-loading {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: var(--color-bg);
                    color: var(--color-text);
                    gap: 1rem;
                }

                .spinner {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

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

                .user-info {
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 0.5rem;
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                }

                .user-info p {
                    color: var(--color-text-muted);
                    font-size: 0.9rem;
                    margin-bottom: 0.25rem;
                }

                .user-info strong {
                    color: var(--color-text);
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

                    .checkout-container {
                        padding: 0 1rem;
                    }
                }
            `}</style>
        </>
    );
};
