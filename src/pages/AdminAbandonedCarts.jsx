import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Mail, Clock, RefreshCw, Send, TrendingUp, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://videomaster-api.up.railway.app';

export function AdminAbandonedCarts() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, 1hour, 24hour, 72hour
  const [stats, setStats] = useState({
    total_abandoned: 0,
    recovered: 0,
    pending_emails: 0,
    recovery_rate: 0,
    potential_revenue: 0
  });

  useEffect(() => {
    fetchData();
  }, [filter]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const url = filter === 'all'
        ? `${API_URL}/api/cart/admin/abandoned`
        : `${API_URL}/api/cart/admin/abandoned?stage=${filter}`;

      const [ordersRes, statsRes] = await Promise.all([
        fetch(url, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/cart/admin/stats`, { headers: getAuthHeaders() })
      ]);

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch (err) {
      setError('Veriler yuklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const triggerEmails = async () => {
    setProcessing(true);
    try {
      const response = await fetch(`${API_URL}/api/cart/admin/trigger-emails`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(`${data.emails_sent} email gonderildi!`);
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const err = await response.json();
        setError(err.detail || 'Email gonderilemedi');
      }
    } catch (err) {
      setError('Bir hata olustu');
    } finally {
      setProcessing(false);
    }
  };

  const sendManualEmail = async (orderId, stage) => {
    try {
      const response = await fetch(`${API_URL}/api/cart/admin/send-email/${orderId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ stage })
      });

      if (response.ok) {
        setSuccess('Email gonderildi!');
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const err = await response.json();
        setError(err.detail || 'Email gonderilemedi');
      }
    } catch (err) {
      setError('Bir hata olustu');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount || 0);
  };

  const getTimeSinceAbandoned = (abandonedAt) => {
    if (!abandonedAt) return '-';
    const now = new Date();
    const abandoned = new Date(abandonedAt);
    const hours = Math.floor((now - abandoned) / (1000 * 60 * 60));

    if (hours < 1) return 'Az once';
    if (hours < 24) return `${hours} saat once`;
    const days = Math.floor(hours / 24);
    return `${days} gun once`;
  };

  const getEmailStage = (order) => {
    if (order.recovery_email_3_sent) return { stage: 3, label: '3. Email Gonderildi', color: '#a78bfa' };
    if (order.recovery_email_2_sent) return { stage: 2, label: '2. Email Gonderildi', color: '#fbbf24' };
    if (order.recovery_email_1_sent) return { stage: 1, label: '1. Email Gonderildi', color: '#00d9ff' };
    return { stage: 0, label: 'Email Gonderilmedi', color: '#666' };
  };

  const getNextAction = (order) => {
    const now = new Date();
    const abandoned = new Date(order.abandoned_at);
    const hoursSince = (now - abandoned) / (1000 * 60 * 60);

    if (!order.recovery_email_1_sent && hoursSince >= 1) {
      return { action: 'send1', label: '1. Email Gonder' };
    }
    if (order.recovery_email_1_sent && !order.recovery_email_2_sent && hoursSince >= 24) {
      return { action: 'send2', label: '2. Email Gonder' };
    }
    if (order.recovery_email_2_sent && !order.recovery_email_3_sent && hoursSince >= 72) {
      return { action: 'send3', label: '3. Email Gonder' };
    }
    return null;
  };

  if (loading && orders.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Yukleniyor...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <Link to="/0110" style={styles.backLink}>
          <ArrowLeft size={20} /> Admin Hub
        </Link>
        <h1 style={styles.title}>Terk Edilmis Sepetler</h1>
      </div>

      {/* Messages */}
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <ShoppingCart size={24} />
          </div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{stats.total_abandoned}</div>
            <div style={styles.statLabel}>Terk Edilmis</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: 'rgba(0, 255, 157, 0.2)', color: '#00ff9d' }}>
            <TrendingUp size={24} />
          </div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{stats.recovered}</div>
            <div style={styles.statLabel}>Kurtarilan</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' }}>
            <Mail size={24} />
          </div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{stats.pending_emails}</div>
            <div style={styles.statLabel}>Bekleyen Email</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: 'rgba(112, 0, 255, 0.2)', color: '#a78bfa' }}>
            <AlertCircle size={24} />
          </div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{formatCurrency(stats.potential_revenue)}</div>
            <div style={styles.statLabel}>Potansiyel Gelir</div>
          </div>
        </div>
      </div>

      {/* Recovery Rate */}
      <div style={styles.recoveryCard}>
        <div style={styles.recoveryHeader}>
          <h3 style={styles.recoveryTitle}>Kurtarma Orani</h3>
          <span style={styles.recoveryRate}>{stats.recovery_rate?.toFixed(1) || 0}%</span>
        </div>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${stats.recovery_rate || 0}%`
            }}
          />
        </div>
        <p style={styles.recoveryHint}>
          Email otomasyonu ile terk edilmis sepetleri kurtarma oraniniz
        </p>
      </div>

      {/* Actions */}
      <div style={styles.actionsBar}>
        <div style={styles.filterButtons}>
          {[
            { key: 'all', label: 'Tumu' },
            { key: '1hour', label: '1 Saat+' },
            { key: '24hour', label: '24 Saat+' },
            { key: '72hour', label: '72 Saat+' }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                ...styles.filterButton,
                ...(filter === f.key ? styles.filterButtonActive : {})
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          onClick={triggerEmails}
          disabled={processing}
          style={styles.triggerButton}
        >
          <RefreshCw size={16} className={processing ? 'spinning' : ''} />
          {processing ? 'Gonderiliyor...' : 'Otomatik Email Gonder'}
        </button>
      </div>

      {/* Email Stages Info */}
      <div style={styles.stagesInfo}>
        <div style={styles.stageItem}>
          <Clock size={16} style={{ color: '#00d9ff' }} />
          <span>1 saat sonra: Hatirlatma emaili</span>
        </div>
        <div style={styles.stageItem}>
          <Clock size={16} style={{ color: '#fbbf24' }} />
          <span>24 saat sonra: Son sans emaili</span>
        </div>
        <div style={styles.stageItem}>
          <Clock size={16} style={{ color: '#a78bfa' }} />
          <span>72 saat sonra: %10 indirim kodu</span>
        </div>
      </div>

      {/* Orders List */}
      <div style={styles.ordersList}>
        {orders.length === 0 ? (
          <div style={styles.emptyState}>
            <ShoppingCart size={48} style={{ color: '#333', marginBottom: '1rem' }} />
            <p>Terk edilmis sepet bulunmuyor.</p>
            <p style={styles.emptyHint}>
              Checkout'a gelip odeme yapmayan kullanicilar burada gorunecek.
            </p>
          </div>
        ) : (
          orders.map(order => {
            const emailStage = getEmailStage(order);
            const nextAction = getNextAction(order);

            return (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div style={styles.orderInfo}>
                    <span style={styles.orderCode}>#{order.order_code}</span>
                    <span style={styles.orderEmail}>{order.user_email}</span>
                  </div>
                  <div style={styles.orderAmount}>
                    {formatCurrency(order.amount)}
                  </div>
                </div>

                <div style={styles.orderDetails}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Urun:</span>
                    <span style={styles.detailValue}>{order.product_name}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Terk Edilme:</span>
                    <span style={styles.detailValue}>
                      {formatDate(order.abandoned_at)}
                      <span style={styles.timeAgo}>({getTimeSinceAbandoned(order.abandoned_at)})</span>
                    </span>
                  </div>
                </div>

                <div style={styles.orderFooter}>
                  <div style={styles.emailStatus}>
                    <span style={{
                      ...styles.stageBadge,
                      backgroundColor: `${emailStage.color}20`,
                      color: emailStage.color
                    }}>
                      {emailStage.label}
                    </span>

                    {order.recovery_token && (
                      <span style={styles.tokenBadge}>
                        Token: {order.recovery_token.substring(0, 8)}...
                      </span>
                    )}
                  </div>

                  <div style={styles.orderActions}>
                    {nextAction && (
                      <button
                        onClick={() => sendManualEmail(order.id, nextAction.action)}
                        style={styles.sendButton}
                      >
                        <Send size={14} />
                        {nextAction.label}
                      </button>
                    )}

                    {!order.recovery_email_1_sent && (
                      <button
                        onClick={() => sendManualEmail(order.id, 'send1')}
                        style={{ ...styles.sendButton, backgroundColor: 'rgba(0, 217, 255, 0.2)', color: '#00d9ff' }}
                      >
                        <Send size={14} />
                        1. Email
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#fff',
    padding: '2rem',
  },
  header: {
    marginBottom: '2rem',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#a0a0a0',
    textDecoration: 'none',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    color: '#666',
  },
  error: {
    backgroundColor: 'rgba(255, 77, 87, 0.1)',
    border: '1px solid #ff4d57',
    color: '#ff4d57',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
  },
  success: {
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    border: '1px solid #00ff9d',
    color: '#00ff9d',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '0.75rem',
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    color: '#f97316',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#666',
  },
  recoveryCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  recoveryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  recoveryTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    margin: 0,
  },
  recoveryRate: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#00ff9d',
  },
  progressBar: {
    height: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '0.75rem',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #00ff9d, #00d9ff)',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  recoveryHint: {
    fontSize: '0.85rem',
    color: '#666',
    margin: 0,
  },
  actionsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  filterButtons: {
    display: 'flex',
    gap: '0.5rem',
  },
  filterButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.5rem',
    color: '#a0a0a0',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    borderColor: 'rgba(249, 115, 22, 0.3)',
    color: '#f97316',
  },
  triggerButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(0, 255, 157, 0.2)',
    color: '#00ff9d',
    border: '1px solid rgba(0, 255, 157, 0.3)',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  stagesInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '0.75rem',
    marginBottom: '1.5rem',
  },
  stageItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#a0a0a0',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem',
    color: '#666',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
  },
  emptyHint: {
    fontSize: '0.85rem',
    marginTop: '0.5rem',
  },
  orderCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  orderInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  orderCode: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#f97316',
  },
  orderEmail: {
    fontSize: '0.9rem',
    color: '#a0a0a0',
  },
  orderAmount: {
    fontSize: '1.25rem',
    fontWeight: '700',
  },
  orderDetails: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '0.5rem',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  detailLabel: {
    fontSize: '0.8rem',
    color: '#666',
  },
  detailValue: {
    fontSize: '0.9rem',
  },
  timeAgo: {
    marginLeft: '0.5rem',
    color: '#f97316',
    fontSize: '0.8rem',
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  emailStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  stageBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  tokenBadge: {
    padding: '0.25rem 0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    color: '#666',
  },
  orderActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  sendButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.5rem 0.75rem',
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    color: '#f97316',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
};

export default AdminAbandonedCarts;
