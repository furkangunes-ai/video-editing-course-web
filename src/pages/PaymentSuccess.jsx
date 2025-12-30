import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { CheckCircle, ArrowRight, PartyPopper } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderCode = searchParams.get('order');
    const { refreshUser } = useAuth();

    useEffect(() => {
        // Kullanıcı bilgisini yenile (has_access güncellenmiş olacak)
        refreshUser?.();
    }, [refreshUser]);

    return (
        <>
            <Navbar />
            <div className="success-page">
                <div className="success-container">
                    <div className="success-icon">
                        <CheckCircle size={80} />
                    </div>

                    <h1>Ödeme Başarılı! 🎉</h1>
                    <p className="success-message">
                        Tebrikler! Video Editörlüğü Ustalık Sınıfı kursuna erişiminiz aktif edildi.
                    </p>

                    {orderCode && (
                        <p className="order-code">
                            Sipariş Kodu: <strong>{orderCode}</strong>
                        </p>
                    )}

                    <div className="action-buttons">
                        <Link to="/dashboard" className="primary-btn">
                            <span>Kursa Başla</span>
                            <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="info-box">
                        <h3>Sonraki Adımlar</h3>
                        <ul>
                            <li>✓ Kurslara erişiminiz aktif edildi</li>
                            <li>✓ WhatsApp destek grubuna katılabilirsiniz</li>
                            <li>✓ Tüm derslere ömür boyu erişiminiz var</li>
                        </ul>
                    </div>
                </div>
            </div>

            <style>{`
                .success-page {
                    min-height: 100vh;
                    padding-top: 120px;
                    padding-bottom: 4rem;
                    background: var(--color-bg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .success-container {
                    text-align: center;
                    max-width: 500px;
                    padding: 0 1rem;
                }

                .success-icon {
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 2rem;
                    background: linear-gradient(135deg, rgba(0, 255, 157, 0.2), rgba(0, 255, 157, 0.05));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #00ff9d;
                    animation: pulse 2s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                h1 {
                    color: var(--color-text);
                    font-size: 2rem;
                    margin-bottom: 1rem;
                }

                .success-message {
                    color: var(--color-text-muted);
                    font-size: 1.1rem;
                    line-height: 1.6;
                    margin-bottom: 1rem;
                }

                .order-code {
                    color: var(--color-text-muted);
                    font-size: 0.9rem;
                    margin-bottom: 2rem;
                }

                .order-code strong {
                    color: #00ff9d;
                }

                .action-buttons {
                    margin-bottom: 2rem;
                }

                .primary-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem 2rem;
                    background: linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%);
                    color: #000;
                    font-weight: 700;
                    font-size: 1.1rem;
                    border-radius: 0.75rem;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .primary-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(0, 255, 157, 0.4);
                }

                .info-box {
                    background: rgba(20, 20, 20, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    text-align: left;
                }

                .info-box h3 {
                    color: var(--color-text);
                    font-size: 1rem;
                    margin-bottom: 1rem;
                }

                .info-box ul {
                    list-style: none;
                }

                .info-box li {
                    color: var(--color-text-muted);
                    padding: 0.5rem 0;
                    font-size: 0.9rem;
                }
            `}</style>
        </>
    );
};
