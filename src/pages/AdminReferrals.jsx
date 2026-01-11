import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, DollarSign, TrendingUp, Gift, Search, Copy, Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://videomaster-api.up.railway.app';

export function AdminReferrals() {
  const [referrals, setReferrals] = useState([]);
  const [discountCodes, setDiscountCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('referrals');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);
  const [stats, setStats] = useState({
    total_referrals: 0,
    active_referrals: 0,
    total_earnings: 0,
    total_discounts_given: 0,
    top_referrers: []
  });

  // New discount code form
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [codeForm, setCodeForm] = useState({
    code: '',
    discount_type: 'fixed',
    discount_value: 30,
    max_uses: 100,
    expires_days: 30
  });

  useEffect(() => {
    fetchData();
  }, []);

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
      const [referralsRes, statsRes, codesRes] = await Promise.all([
        fetch(`${API_URL}/api/referrals/admin/all`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/referrals/admin/stats`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/referrals/admin/discount-codes`, { headers: getAuthHeaders() })
      ]);

      if (referralsRes.ok) {
        const data = await referralsRes.json();
        setReferrals(data);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }

      if (codesRes.ok) {
        const data = await codesRes.json();
        setDiscountCodes(data);
      }
    } catch (err) {
      setError('Veriler yuklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const createDiscountCode = async () => {
    try {
      const response = await fetch(`${API_URL}/api/referrals/admin/discount-codes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(codeForm)
      });

      if (response.ok) {
        setSuccess('Indirim kodu olusturuldu!');
        setShowCodeForm(false);
        setCodeForm({
          code: '',
          discount_type: 'fixed',
          discount_value: 30,
          max_uses: 100,
          expires_days: 30
        });
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const err = await response.json();
        setError(err.detail || 'Kod olusturulamadi');
      }
    } catch (err) {
      setError('Bir hata olustu');
    }
  };

  const toggleCodeStatus = async (codeId, isActive) => {
    try {
      const response = await fetch(`${API_URL}/api/referrals/admin/discount-codes/${codeId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_active: !isActive })
      });

      if (response.ok) {
        setSuccess(isActive ? 'Kod devre disi birakildi' : 'Kod aktif edildi');
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Islem basarisiz');
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount || 0);
  };

  const filteredReferrals = referrals.filter(ref => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      ref.referrer_email?.toLowerCase().includes(search) ||
      ref.referred_email?.toLowerCase().includes(search) ||
      ref.referrer_code?.toLowerCase().includes(search)
    );
  });

  if (loading && referrals.length === 0) {
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
        <h1 style={styles.title}>Referans Programi</h1>
      </div>

      {/* Messages */}
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <Users size={24} />
          </div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{stats.total_referrals}</div>
            <div style={styles.statLabel}>Toplam Referans</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: 'rgba(0, 255, 157, 0.2)', color: '#00ff9d' }}>
            <TrendingUp size={24} />
          </div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{stats.active_referrals}</div>
            <div style={styles.statLabel}>Aktif Referans</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' }}>
            <DollarSign size={24} />
          </div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{formatCurrency(stats.total_earnings)}</div>
            <div style={styles.statLabel}>Toplam Kazanc</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: 'rgba(112, 0, 255, 0.2)', color: '#a78bfa' }}>
            <Gift size={24} />
          </div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{formatCurrency(stats.total_discounts_given)}</div>
            <div style={styles.statLabel}>Verilen Indirimler</div>
          </div>
        </div>
      </div>

      {/* Top Referrers */}
      {stats.top_referrers?.length > 0 && (
        <div style={styles.topReferrers}>
          <h3 style={styles.sectionTitle}>En Basarili Referanscilar</h3>
          <div style={styles.topList}>
            {stats.top_referrers.slice(0, 5).map((ref, index) => (
              <div key={ref.user_id} style={styles.topItem}>
                <div style={styles.topRank}>{index + 1}</div>
                <div style={styles.topInfo}>
                  <span style={styles.topName}>{ref.email}</span>
                  <span style={styles.topStats}>
                    {ref.count} referans | {formatCurrency(ref.earnings)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('referrals')}
          style={{
            ...styles.tab,
            ...(activeTab === 'referrals' ? styles.tabActive : {})
          }}
        >
          Referanslar
        </button>
        <button
          onClick={() => setActiveTab('codes')}
          style={{
            ...styles.tab,
            ...(activeTab === 'codes' ? styles.tabActive : {})
          }}
        >
          Indirim Kodlari
        </button>
      </div>

      {/* Referrals Tab */}
      {activeTab === 'referrals' && (
        <>
          <div style={styles.searchBox}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Email veya kod ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Referans Veren</th>
                  <th style={styles.th}>Davet Edilen</th>
                  <th style={styles.th}>Kod</th>
                  <th style={styles.th}>Durum</th>
                  <th style={styles.th}>Odul</th>
                  <th style={styles.th}>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrals.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={styles.emptyCell}>
                      Henuz referans bulunmuyor
                    </td>
                  </tr>
                ) : (
                  filteredReferrals.map(ref => (
                    <tr key={ref.id} style={styles.tr}>
                      <td style={styles.td}>{ref.referrer_email}</td>
                      <td style={styles.td}>{ref.referred_email}</td>
                      <td style={styles.td}>
                        <code style={styles.codeText}>{ref.referrer_code}</code>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: ref.status === 'active'
                            ? 'rgba(0, 255, 157, 0.2)'
                            : ref.status === 'pending'
                              ? 'rgba(251, 191, 36, 0.2)'
                              : 'rgba(255, 255, 255, 0.1)',
                          color: ref.status === 'active'
                            ? '#00ff9d'
                            : ref.status === 'pending'
                              ? '#fbbf24'
                              : '#666'
                        }}>
                          {ref.status === 'active' ? 'Aktif' :
                            ref.status === 'pending' ? 'Bekliyor' : 'Odendi'}
                        </span>
                      </td>
                      <td style={styles.td}>{formatCurrency(ref.referrer_reward)}</td>
                      <td style={styles.td}>{formatDate(ref.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Discount Codes Tab */}
      {activeTab === 'codes' && (
        <>
          <div style={styles.codeHeader}>
            <button
              onClick={() => setShowCodeForm(!showCodeForm)}
              style={styles.addButton}
            >
              + Yeni Indirim Kodu
            </button>
          </div>

          {showCodeForm && (
            <div style={styles.codeForm}>
              <h3 style={styles.formTitle}>Yeni Indirim Kodu Olustur</h3>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Kod</label>
                  <input
                    type="text"
                    value={codeForm.code}
                    onChange={(e) => setCodeForm({ ...codeForm, code: e.target.value.toUpperCase() })}
                    style={styles.input}
                    placeholder="Ornegin: HOSGELDIN10"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Indirim Tipi</label>
                  <select
                    value={codeForm.discount_type}
                    onChange={(e) => setCodeForm({ ...codeForm, discount_type: e.target.value })}
                    style={styles.input}
                  >
                    <option value="fixed">Sabit Tutar (TL)</option>
                    <option value="percentage">Yuzde (%)</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Indirim Degeri {codeForm.discount_type === 'percentage' ? '(%)' : '(TL)'}
                  </label>
                  <input
                    type="number"
                    value={codeForm.discount_value}
                    onChange={(e) => setCodeForm({ ...codeForm, discount_value: parseFloat(e.target.value) })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Maksimum Kullanim</label>
                  <input
                    type="number"
                    value={codeForm.max_uses}
                    onChange={(e) => setCodeForm({ ...codeForm, max_uses: parseInt(e.target.value) })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Gecerlilik (Gun)</label>
                  <input
                    type="number"
                    value={codeForm.expires_days}
                    onChange={(e) => setCodeForm({ ...codeForm, expires_days: parseInt(e.target.value) })}
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.formActions}>
                <button onClick={() => setShowCodeForm(false)} style={styles.cancelButton}>
                  Iptal
                </button>
                <button onClick={createDiscountCode} style={styles.saveButton}>
                  Olustur
                </button>
              </div>
            </div>
          )}

          <div style={styles.codesList}>
            {discountCodes.length === 0 ? (
              <div style={styles.emptyState}>
                <p>Henuz indirim kodu bulunmuyor.</p>
              </div>
            ) : (
              discountCodes.map(code => (
                <div key={code.id} style={styles.codeCard}>
                  <div style={styles.codeMain}>
                    <div style={styles.codeValue}>
                      <code style={styles.codeBig}>{code.code}</code>
                      <button
                        onClick={() => copyToClipboard(code.code)}
                        style={styles.copyButton}
                      >
                        {copiedCode === code.code ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                    <div style={styles.codeDetails}>
                      <span style={styles.codeDiscount}>
                        {code.discount_type === 'percentage'
                          ? `%${code.discount_value} Indirim`
                          : `${formatCurrency(code.discount_value)} Indirim`
                        }
                      </span>
                      <span style={styles.codeUsage}>
                        {code.used_count} / {code.max_uses} kullanim
                      </span>
                    </div>
                  </div>
                  <div style={styles.codeActions}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: code.is_active ? 'rgba(0, 255, 157, 0.2)' : 'rgba(255, 77, 87, 0.2)',
                      color: code.is_active ? '#00ff9d' : '#ff4d57'
                    }}>
                      {code.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                    <span style={styles.codeExpiry}>
                      {code.expires_at ? `Son: ${formatDate(code.expires_at)}` : 'Suresi yok'}
                    </span>
                    <button
                      onClick={() => toggleCodeStatus(code.id, code.is_active)}
                      style={{
                        ...styles.toggleButton,
                        backgroundColor: code.is_active ? 'rgba(255, 77, 87, 0.2)' : 'rgba(0, 255, 157, 0.2)',
                        color: code.is_active ? '#ff4d57' : '#00ff9d'
                      }}
                    >
                      {code.is_active ? 'Devre Disi Birak' : 'Aktif Et'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
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
    background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
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
    backgroundColor: 'rgba(0, 217, 255, 0.2)',
    color: '#00d9ff',
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
  topReferrers: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  topList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  topItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '0.5rem',
  },
  topRank: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    color: '#fbbf24',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  topInfo: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topName: {
    fontWeight: '500',
  },
  topStats: {
    fontSize: '0.85rem',
    color: '#00ff9d',
  },
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '0.5rem',
  },
  tab: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    borderRadius: '0.5rem 0.5rem 0 0',
    transition: 'all 0.2s',
  },
  tabActive: {
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    color: '#a78bfa',
  },
  searchBox: {
    position: 'relative',
    maxWidth: '400px',
    marginBottom: '1.5rem',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666',
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.5rem',
    color: '#fff',
    fontSize: '0.9rem',
    boxSizing: 'border-box',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#666',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  td: {
    padding: '1rem',
    fontSize: '0.9rem',
  },
  emptyCell: {
    padding: '3rem',
    textAlign: 'center',
    color: '#666',
  },
  codeText: {
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    color: '#a78bfa',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.8rem',
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  codeHeader: {
    marginBottom: '1.5rem',
  },
  addButton: {
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    color: '#a78bfa',
    border: '1px solid rgba(167, 139, 250, 0.3)',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  codeForm: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  formTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.85rem',
    color: '#a0a0a0',
  },
  input: {
    padding: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.5rem',
    color: '#fff',
    fontSize: '0.9rem',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '1.5rem',
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.5rem',
    color: '#a0a0a0',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#a78bfa',
    border: 'none',
    borderRadius: '0.5rem',
    color: '#000',
    cursor: 'pointer',
    fontWeight: '600',
  },
  codesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
  },
  codeCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  codeMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  codeValue: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  codeBig: {
    fontSize: '1.25rem',
    fontWeight: '600',
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    color: '#a78bfa',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    letterSpacing: '0.1em',
  },
  copyButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    padding: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeDetails: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.85rem',
  },
  codeDiscount: {
    color: '#00ff9d',
    fontWeight: '500',
  },
  codeUsage: {
    color: '#666',
  },
  codeActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  codeExpiry: {
    fontSize: '0.85rem',
    color: '#666',
  },
  toggleButton: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
};

export default AdminReferrals;
