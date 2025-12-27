import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'https://videomaster-backend-production.up.railway.app';

export function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [realtime, setRealtime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchStats = async (key) => {
    try {
      const [statsRes, realtimeRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/analytics/stats?admin_key=${encodeURIComponent(key)}&days=30`),
        fetch(`${API_BASE_URL}/api/analytics/realtime?admin_key=${encodeURIComponent(key)}`),
      ]);

      const statsData = await statsRes.json();
      const realtimeData = await realtimeRes.json();

      if (statsData.error || realtimeData.error) {
        setError('Yetkisiz erişim');
        return;
      }

      setStats(statsData);
      setRealtime(realtimeData);
      setIsAuthenticated(true);
      setError('');
    } catch (err) {
      setError('Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchStats(adminKey);
  };

  // Auto-refresh realtime data every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetch(`${API_BASE_URL}/api/analytics/realtime?admin_key=${encodeURIComponent(adminKey)}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) setRealtime(data);
        });
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, adminKey]);

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.loginCard}>
          <Link to="/dashboard" style={styles.backLink}>← Dashboard</Link>
          <h1 style={styles.title}>Admin Analytics</h1>
          <p style={styles.subtitle}>Admin anahtarını girin</p>

          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Admin Key"
              style={styles.input}
              required
            />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Yükleniyor...' : 'Giriş'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/dashboard" style={styles.backLink}>← Dashboard</Link>
        <h1 style={styles.pageTitle}>Analytics Dashboard</h1>
      </div>

      {/* Realtime Stats */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Gerçek Zamanlı (Son 5 dk)</h2>
        <div style={styles.cardGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{realtime?.active_users_estimate || 0}</div>
            <div style={styles.statLabel}>Aktif Kullanıcı</div>
          </div>
        </div>

        {realtime?.active_pages?.length > 0 && (
          <div style={styles.tableContainer}>
            <h3 style={styles.tableTitle}>Aktif Sayfalar</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Sayfa</th>
                  <th style={styles.th}>Görüntüleme</th>
                </tr>
              </thead>
              <tbody>
                {realtime.active_pages.map((page, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{page.path}</td>
                    <td style={styles.td}>{page.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {realtime?.recent_events?.length > 0 && (
          <div style={styles.tableContainer}>
            <h3 style={styles.tableTitle}>Son Olaylar</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Olay</th>
                  <th style={styles.th}>Zaman</th>
                </tr>
              </thead>
              <tbody>
                {realtime.recent_events.map((event, i) => (
                  <tr key={i}>
                    <td style={styles.td}>
                      <span style={styles.eventBadge(event.type)}>{event.type}</span>
                    </td>
                    <td style={styles.td}>{new Date(event.created_at).toLocaleTimeString('tr-TR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Genel Bakış</h2>
        <div style={styles.cardGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats?.summary?.total_users || 0}</div>
            <div style={styles.statLabel}>Toplam Kullanıcı</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats?.summary?.verified_users || 0}</div>
            <div style={styles.statLabel}>Doğrulanmış</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats?.summary?.users_with_access || 0}</div>
            <div style={styles.statLabel}>Kurs Erişimi</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color: '#00ff9d'}}>{stats?.summary?.new_users_24h || 0}</div>
            <div style={styles.statLabel}>Son 24 Saat</div>
          </div>
        </div>
      </div>

      {/* Event Stats */}
      {stats?.events && Object.keys(stats.events).length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Olay İstatistikleri (Son 30 Gün)</h2>
          <div style={styles.cardGrid}>
            {Object.entries(stats.events).map(([type, count]) => (
              <div key={type} style={styles.statCard}>
                <div style={styles.statValue}>{count}</div>
                <div style={styles.statLabel}>{type}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Pages */}
      {stats?.top_pages?.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>En Çok Ziyaret Edilen Sayfalar</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Sayfa</th>
                  <th style={styles.th}>Görüntüleme</th>
                </tr>
              </thead>
              <tbody>
                {stats.top_pages.map((page, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{page.path}</td>
                    <td style={styles.td}>{page.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Daily Stats Chart (Simple) */}
      {stats?.daily_stats?.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Günlük İstatistikler</h2>
          <div style={styles.chartContainer}>
            <div style={styles.chart}>
              {stats.daily_stats.slice(-14).map((day, i) => (
                <div key={i} style={styles.barContainer}>
                  <div
                    style={{
                      ...styles.bar,
                      height: `${Math.max(10, (day.page_views || 0) * 2)}px`,
                    }}
                    title={`${day.date}: ${day.page_views} görüntüleme`}
                  />
                  <div style={styles.barLabel}>{day.date.slice(-5)}</div>
                </div>
              ))}
            </div>
            <div style={styles.chartLegend}>Sayfa Görüntülemeleri (Son 14 gün)</div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    padding: '2rem',
    color: '#fff',
  },
  header: {
    marginBottom: '2rem',
  },
  backLink: {
    color: '#a0a0a0',
    fontSize: '0.9rem',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '1rem',
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  loginCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1.5rem',
    padding: '3rem',
    maxWidth: '400px',
    margin: '0 auto',
    marginTop: '10vh',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#a0a0a0',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '1rem',
    fontSize: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    color: '#fff',
    outline: 'none',
  },
  button: {
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    color: '#000',
    border: 'none',
    borderRadius: '0.75rem',
    cursor: 'pointer',
  },
  error: {
    color: '#ff4757',
    fontSize: '0.9rem',
    margin: 0,
  },
  section: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '1.5rem',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
  },
  statCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '0.5rem',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#a0a0a0',
    textTransform: 'capitalize',
  },
  tableContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginTop: '1rem',
    overflowX: 'auto',
  },
  tableTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '1rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#a0a0a0',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    color: '#fff',
    fontSize: '0.9rem',
  },
  eventBadge: (type) => ({
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    backgroundColor: type === 'registration' ? 'rgba(0, 255, 157, 0.2)' :
                     type === 'login' ? 'rgba(112, 0, 255, 0.2)' :
                     'rgba(255, 255, 255, 0.1)',
    color: type === 'registration' ? '#00ff9d' :
           type === 'login' ? '#a78bfa' :
           '#fff',
  }),
  chartContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  chart: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '200px',
    gap: '0.5rem',
  },
  barContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: '100%',
    maxWidth: '30px',
    background: 'linear-gradient(180deg, #00ff9d 0%, #00cc7d 100%)',
    borderRadius: '4px 4px 0 0',
    minHeight: '10px',
  },
  barLabel: {
    fontSize: '0.6rem',
    color: '#a0a0a0',
    marginTop: '0.5rem',
    transform: 'rotate(-45deg)',
    whiteSpace: 'nowrap',
  },
  chartLegend: {
    textAlign: 'center',
    color: '#a0a0a0',
    fontSize: '0.85rem',
    marginTop: '1.5rem',
  },
};
