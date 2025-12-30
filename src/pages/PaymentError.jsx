import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { XCircle, ArrowRight, RefreshCw, MessageCircle } from 'lucide-react';

export const PaymentError = () => {
    const [searchParams] = useSearchParams();
    const errorMessage = searchParams.get('error') || 'Bilinmeyen hata';

    const getErrorText = (error) => {
        switch (error) {
            case 'order_not_found':
                return 'Sipariş bulunamadı. Lütfen tekrar deneyin.';
            case 'invalid_signature':
                return 'Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.';
            default:
                return error;
        }
    };

    return (
        <>
            <Navbar />
            <div className="error-page">
                <div className="error-container">
                    <div className="error-icon">
                        <XCircle size={80} />
                    </div>

                    <h1>Ödeme Başarısız</h1>
                    <p className="error-message">
                        {getErrorText(errorMessage)}
                    </p>

                    <div className="action-buttons">
                        <Link to="/satin-al" className="primary-btn">
                            <RefreshCw size={20} />
                            <span>Tekrar Dene</span>
                        </Link>

                        <a
                            href="https://wa.me/905011411940?text=Merhaba,%20ödeme%20sırasında%20bir%20sorun%20yaşadım."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="secondary-btn"
                        >
                            <MessageCircle size={20} />
                            <span>Destek Al</span>
                        </a>
                    </div>

                    <div className="help-box">
                        <h3>Yardım</h3>
                        <p>
                            Ödeme işleminiz sırasında bir sorun oluştu. Bu genellikle geçici bir durumdur.
                            Tekrar deneyebilir veya WhatsApp üzerinden bizimle iletişime geçebilirsiniz.
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                .error-page {
                    min-height: 100vh;
                    padding-top: 120px;
                    padding-bottom: 4rem;
                    background: var(--color-bg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .error-container {
                    text-align: center;
                    max-width: 500px;
                    padding: 0 1rem;
                }

                .error-icon {
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 2rem;
                    background: rgba(255, 71, 87, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ff4757;
                }

                h1 {
                    color: var(--color-text);
                    font-size: 2rem;
                    margin-bottom: 1rem;
                }

                .error-message {
                    color: #ff4757;
                    font-size: 1.1rem;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                    padding: 1rem;
                    background: rgba(255, 71, 87, 0.1);
                    border: 1px solid rgba(255, 71, 87, 0.2);
                    border-radius: 0.5rem;
                }

                .action-buttons {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                }

                .primary-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem 2rem;
                    background: linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%);
                    color: #000;
                    font-weight: 700;
                    font-size: 1rem;
                    border-radius: 0.75rem;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .primary-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(0, 255, 157, 0.4);
                }

                .secondary-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem 2rem;
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: var(--color-text);
                    font-weight: 600;
                    font-size: 1rem;
                    border-radius: 0.75rem;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .secondary-btn:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.3);
                }

                .help-box {
                    background: rgba(20, 20, 20, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    text-align: left;
                }

                .help-box h3 {
                    color: var(--color-text);
                    font-size: 1rem;
                    margin-bottom: 0.75rem;
                }

                .help-box p {
                    color: var(--color-text-muted);
                    font-size: 0.9rem;
                    line-height: 1.6;
                }

                @media (max-width: 480px) {
                    .action-buttons {
                        flex-direction: column;
                    }

                    .primary-btn, .secondary-btn {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>
        </>
    );
};
