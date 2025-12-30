import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'https://videomaster-backend-production.up.railway.app';

export function AdminAnalytics() {
  const [dashboard, setDashboard] = useState(null);
  const [realtime, setRealtime] = useState(null);
  const [users, setUsers] = useState(null);
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState(30);
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [orderStatus, setOrderStatus] = useState('');
  const [orderPage, setOrderPage] = useState(1);

  const fetchDashboard = useCallback(async (key, days = 30) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/analytics/dashboard?admin_key=${encodeURIComponent(key)}&days=${days}`
      );
      const data = await response.json();
      if (data.error) {
        setError('Yetkisiz erişim');
        return false;
      }
      setDashboard(data);
      return true;
    } catch (err) {
      setError('Veriler yüklenemedi');
      return false;
    }
  }, []);

  const fetchRealtime = useCallback(async (key) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/analytics/realtime?admin_key=${encodeURIComponent(key)}`
      );
      const data = await response.json();
      if (!data.error) setRealtime(data);
    } catch (err) {
      console.error('Realtime fetch error:', err);
    }
  }, []);

  const fetchUsers = useCallback(async (key, page = 1, search = '', filter = '') => {
    try {
      let url = `${API_BASE_URL}/api/analytics/users?admin_key=${encodeURIComponent(key)}&page=${page}&limit=20`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (filter) url += `&filter_type=${filter}`;

      const response = await fetch(url);
      const data = await response.json();
      if (!data.error) setUsers(data);
    } catch (err) {
      console.error('Users fetch error:', err);
    }
  }, []);

  const fetchOrders = useCallback(async (key, page = 1, status = '') => {
    try {
      let url = `${API_BASE_URL}/api/analytics/orders?admin_key=${encodeURIComponent(key)}&page=${page}&limit=20`;
      if (status) url += `&status=${status}`;

      const response = await fetch(url);
      const data = await response.json();
      if (!data.error) setOrders(data);
    } catch (err) {
      console.error('Orders fetch error:', err);
    }
  }, []);

  const toggleUserAccess = async (userId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/analytics/users/${userId}/toggle-access?admin_key=${encodeURIComponent(adminKey)}`,
        { method: 'POST' }
      );
      const data = await response.json();
      if (data.success) {
        fetchUsers(adminKey, userPage, userSearch, userFilter);
      }
    } catch (err) {
      console.error('Toggle access error:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await fetchDashboard(adminKey, dateRange);
    if (success) {
      setIsAuthenticated(true);
      setError('');
      fetchRealtime(adminKey);
    }
    setLoading(false);
  };

  // Auto-refresh realtime
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => fetchRealtime(adminKey), 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, adminKey, fetchRealtime]);

  // Fetch on tab change
  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeTab === 'users') fetchUsers(adminKey, 1, '', '');
    if (activeTab === 'orders') fetchOrders(adminKey, 1, '');
  }, [activeTab, isAuthenticated, adminKey, fetchUsers, fetchOrders]);

  // Fetch on date range change
  useEffect(() => {
    if (isAuthenticated) fetchDashboard(adminKey, dateRange);
  }, [dateRange, isAuthenticated, adminKey, fetchDashboard]);

  // User search/filter
  useEffect(() => {
    if (isAuthenticated && activeTab === 'users') {
      const timer = setTimeout(() => {
        fetchUsers(adminKey, 1, userSearch, userFilter);
        setUserPage(1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [userSearch, userFilter, isAuthenticated, activeTab, adminKey, fetchUsers]);

  // Order filter
  useEffect(() => {
    if (isAuthenticated && activeTab === 'orders') {
      fetchOrders(adminKey, 1, orderStatus);
      setOrderPage(1);
    }
  }, [orderStatus, isAuthenticated, activeTab, adminKey, fetchOrders]);

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.loginCard}>
          <Link to="/" style={styles.backLink}>← Ana Sayfa</Link>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Yönetim paneline erişmek için admin anahtarını girin</p>

          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Admin Key (SECRET_KEY)"
              style={styles.input}
              required
            />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" style={styles.primaryButton} disabled={loading}>
              {loading ? 'Yükleniyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const summary = dashboard?.summary || {};
  const funnel = dashboard?.funnel || {};
  const charts = dashboard?.charts || {};
  const tables = dashboard?.tables || {};

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Link to="/" style={styles.backLink}>← Ana Sayfa</Link>
          <h1 style={styles.pageTitle}>Admin Dashboard</h1>
        </div>
        <div style={styles.headerRight}>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
            style={styles.select}
          >
            <option value={7}>Son 7 gün</option>
            <option value={14}>Son 14 gün</option>
            <option value={30}>Son 30 gün</option>
            <option value={60}>Son 60 gün</option>
            <option value={90}>Son 90 gün</option>
          </select>
          <div style={styles.liveIndicator}>
            <span style={styles.liveDot}></span>
            Canlı: {realtime?.active_users_estimate || 0} aktif
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={styles.tabs}>
        {[
          { id: 'overview', label: 'Genel Bakış' },
          { id: 'revenue', label: 'Gelir' },
          { id: 'users', label: 'Kullanıcılar' },
          { id: 'orders', label: 'Siparişler' },
          { id: 'traffic', label: 'Trafik' },
          { id: 'courses', label: 'Kurslar' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.tabActive : {})
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div style={styles.content}>
          {/* KPI Cards */}
          <div style={styles.kpiGrid}>
            <KPICard
              title="Toplam Gelir"
              value={`₺${summary.revenue?.total?.toLocaleString('tr-TR') || 0}`}
              change={summary.revenue?.growth_percent}
              subtitle={`Dönem: ₺${summary.revenue?.period?.toLocaleString('tr-TR') || 0}`}
              color="#00ff9d"
            />
            <KPICard
              title="Toplam Kullanıcı"
              value={summary.users?.total || 0}
              change={summary.users?.growth_percent}
              subtitle={`Son 24 saat: +${summary.users?.new_24h || 0}`}
              color="#7000ff"
            />
            <KPICard
              title="Başarılı Satış"
              value={summary.orders?.total || 0}
              subtitle={`Bekleyen: ${summary.orders?.pending || 0}`}
              color="#00d9ff"
            />
            <KPICard
              title="Dönüşüm Oranı"
              value={`%${funnel?.overall_conversion_rate || 0}`}
              subtitle={`${funnel?.purchases || 0} / ${funnel?.unique_visitors || 0} ziyaretçi`}
              color="#ff9d00"
            />
          </div>

          {/* Conversion Funnel */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Dönüşüm Hunisi</h2>
            <div style={styles.funnelContainer}>
              <FunnelStep
                label="Benzersiz Ziyaretçi"
                value={funnel?.unique_visitors || 0}
                width={100}
                color="#7000ff"
              />
              <FunnelStep
                label="Ödeme Sayfası"
                value={funnel?.checkout_views || 0}
                rate={funnel?.visitor_to_checkout_rate}
                width={Math.max(20, funnel?.visitor_to_checkout_rate || 0)}
                color="#00d9ff"
              />
              <FunnelStep
                label="Satın Alma"
                value={funnel?.purchases || 0}
                rate={funnel?.checkout_to_purchase_rate}
                width={Math.max(10, funnel?.overall_conversion_rate * 10 || 0)}
                color="#00ff9d"
              />
            </div>
          </div>

          {/* Two Column Layout */}
          <div style={styles.twoColumn}>
            {/* Recent Orders */}
            <div style={styles.tableCard}>
              <h3 style={styles.tableTitle}>Son Siparişler</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Kod</th>
                    <th style={styles.th}>Tutar</th>
                    <th style={styles.th}>Durum</th>
                    <th style={styles.th}>Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.recent_orders?.slice(0, 5).map((order, i) => (
                    <tr key={i}>
                      <td style={styles.td}>{order.order_code?.slice(-8)}</td>
                      <td style={styles.td}>₺{order.amount}</td>
                      <td style={styles.td}>
                        <StatusBadge status={order.status} />
                      </td>
                      <td style={styles.td}>{formatDate(order.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recent Users */}
            <div style={styles.tableCard}>
              <h3 style={styles.tableTitle}>Son Kullanıcılar</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Durum</th>
                    <th style={styles.th}>Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.recent_users?.slice(0, 5).map((user, i) => (
                    <tr key={i}>
                      <td style={styles.td}>{user.email?.slice(0, 20)}...</td>
                      <td style={styles.td}>
                        {user.has_access ? (
                          <span style={styles.badgeSuccess}>Erişim Var</span>
                        ) : user.verified ? (
                          <span style={styles.badgeWarning}>Doğrulanmış</span>
                        ) : (
                          <span style={styles.badgeMuted}>Bekliyor</span>
                        )}
                      </td>
                      <td style={styles.td}>{formatDate(user.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Events Summary */}
          {tables.events && Object.keys(tables.events).length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Olay İstatistikleri</h2>
              <div style={styles.eventGrid}>
                {Object.entries(tables.events).map(([type, count]) => (
                  <div key={type} style={styles.eventCard}>
                    <div style={styles.eventCount}>{count}</div>
                    <div style={styles.eventType}>{type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'revenue' && (
        <div style={styles.content}>
          {/* Revenue KPIs */}
          <div style={styles.kpiGrid}>
            <KPICard
              title="Toplam Gelir"
              value={`₺${summary.revenue?.total?.toLocaleString('tr-TR') || 0}`}
              color="#00ff9d"
              large
            />
            <KPICard
              title="Dönem Geliri"
              value={`₺${summary.revenue?.period?.toLocaleString('tr-TR') || 0}`}
              change={summary.revenue?.growth_percent}
              color="#00d9ff"
            />
            <KPICard
              title="Ortalama Sipariş"
              value={`₺${summary.revenue?.avg_order_value?.toLocaleString('tr-TR') || 0}`}
              color="#7000ff"
            />
            <KPICard
              title="Toplam Sipariş"
              value={summary.orders?.total || 0}
              color="#ff9d00"
            />
          </div>

          {/* Daily Revenue Chart */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Günlük Gelir</h2>
            <div style={styles.chartCard}>
              <BarChart
                data={charts.daily_revenue || []}
                dataKey="revenue"
                labelKey="date"
                color="#00ff9d"
                prefix="₺"
              />
            </div>
          </div>

          {/* Orders by Status */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Sipariş Durumları</h2>
            <div style={styles.statusCards}>
              <div style={{...styles.statusCard, borderColor: '#00ff9d'}}>
                <div style={styles.statusIcon}>✓</div>
                <div style={styles.statusValue}>{summary.orders?.total || 0}</div>
                <div style={styles.statusLabel}>Başarılı</div>
              </div>
              <div style={{...styles.statusCard, borderColor: '#ffaa00'}}>
                <div style={styles.statusIcon}>⏳</div>
                <div style={styles.statusValue}>{summary.orders?.pending || 0}</div>
                <div style={styles.statusLabel}>Bekleyen</div>
              </div>
              <div style={{...styles.statusCard, borderColor: '#ff4757'}}>
                <div style={styles.statusIcon}>✗</div>
                <div style={styles.statusValue}>{summary.orders?.failed || 0}</div>
                <div style={styles.statusLabel}>Başarısız</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div style={styles.content}>
          {/* User Stats */}
          <div style={styles.kpiGrid}>
            <KPICard title="Toplam" value={summary.users?.total || 0} color="#7000ff" />
            <KPICard title="Doğrulanmış" value={summary.users?.verified || 0} color="#00d9ff" />
            <KPICard title="Kurs Erişimi" value={summary.users?.with_access || 0} color="#00ff9d" />
            <KPICard title="Son 7 Gün" value={summary.users?.new_7d || 0} color="#ff9d00" />
          </div>

          {/* Filters */}
          <div style={styles.filterBar}>
            <input
              type="text"
              placeholder="Email veya isim ara..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              style={styles.searchInput}
            />
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              style={styles.select}
            >
              <option value="">Tüm Kullanıcılar</option>
              <option value="verified">Doğrulanmış</option>
              <option value="unverified">Doğrulanmamış</option>
              <option value="with_access">Erişimi Var</option>
              <option value="no_access">Erişimi Yok</option>
            </select>
          </div>

          {/* Users Table */}
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>İsim</th>
                  <th style={styles.th}>Doğrulama</th>
                  <th style={styles.th}>Erişim</th>
                  <th style={styles.th}>Kayıt</th>
                  <th style={styles.th}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {users?.users?.map((user) => (
                  <tr key={user.id}>
                    <td style={styles.td}>{user.id}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>{user.name || '-'}</td>
                    <td style={styles.td}>
                      {user.verified ? (
                        <span style={styles.badgeSuccess}>Evet</span>
                      ) : (
                        <span style={styles.badgeMuted}>Hayır</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      {user.has_access ? (
                        <span style={styles.badgeSuccess}>Var</span>
                      ) : (
                        <span style={styles.badgeMuted}>Yok</span>
                      )}
                    </td>
                    <td style={styles.td}>{formatDate(user.created_at)}</td>
                    <td style={styles.td}>
                      <button
                        onClick={() => toggleUserAccess(user.id)}
                        style={user.has_access ? styles.dangerButton : styles.successButton}
                      >
                        {user.has_access ? 'Erişimi Kapat' : 'Erişim Ver'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {users && users.pages > 1 && (
              <div style={styles.pagination}>
                <button
                  onClick={() => {
                    setUserPage(p => Math.max(1, p - 1));
                    fetchUsers(adminKey, userPage - 1, userSearch, userFilter);
                  }}
                  disabled={userPage === 1}
                  style={styles.pageButton}
                >
                  ← Önceki
                </button>
                <span style={styles.pageInfo}>
                  Sayfa {userPage} / {users.pages} (Toplam: {users.total})
                </span>
                <button
                  onClick={() => {
                    setUserPage(p => Math.min(users.pages, p + 1));
                    fetchUsers(adminKey, userPage + 1, userSearch, userFilter);
                  }}
                  disabled={userPage === users.pages}
                  style={styles.pageButton}
                >
                  Sonraki →
                </button>
              </div>
            )}
          </div>

          {/* Daily Registrations Chart */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Günlük Kayıtlar</h2>
            <div style={styles.chartCard}>
              <BarChart
                data={charts.daily_registrations || []}
                dataKey="count"
                labelKey="date"
                color="#7000ff"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div style={styles.content}>
          {/* Filter */}
          <div style={styles.filterBar}>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              style={styles.select}
            >
              <option value="">Tüm Siparişler</option>
              <option value="success">Başarılı</option>
              <option value="pending">Bekleyen</option>
              <option value="failed">Başarısız</option>
            </select>
          </div>

          {/* Orders Table */}
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Sipariş Kodu</th>
                  <th style={styles.th}>Kullanıcı</th>
                  <th style={styles.th}>Ürün</th>
                  <th style={styles.th}>Tutar</th>
                  <th style={styles.th}>Durum</th>
                  <th style={styles.th}>Oluşturulma</th>
                  <th style={styles.th}>Ödeme</th>
                </tr>
              </thead>
              <tbody>
                {orders?.orders?.map((order) => (
                  <tr key={order.id}>
                    <td style={styles.td}>{order.id}</td>
                    <td style={styles.td}><code>{order.order_code}</code></td>
                    <td style={styles.td}>
                      <div>{order.user_email || '-'}</div>
                      <small style={{color: '#666'}}>{order.user_name}</small>
                    </td>
                    <td style={styles.td}>{order.product}</td>
                    <td style={styles.td}>₺{order.amount}</td>
                    <td style={styles.td}><StatusBadge status={order.status} /></td>
                    <td style={styles.td}>{formatDate(order.created_at)}</td>
                    <td style={styles.td}>{order.paid_at ? formatDate(order.paid_at) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {orders && orders.pages > 1 && (
              <div style={styles.pagination}>
                <button
                  onClick={() => {
                    setOrderPage(p => Math.max(1, p - 1));
                    fetchOrders(adminKey, orderPage - 1, orderStatus);
                  }}
                  disabled={orderPage === 1}
                  style={styles.pageButton}
                >
                  ← Önceki
                </button>
                <span style={styles.pageInfo}>
                  Sayfa {orderPage} / {orders.pages} (Toplam: {orders.total})
                </span>
                <button
                  onClick={() => {
                    setOrderPage(p => Math.min(orders.pages, p + 1));
                    fetchOrders(adminKey, orderPage + 1, orderStatus);
                  }}
                  disabled={orderPage === orders.pages}
                  style={styles.pageButton}
                >
                  Sonraki →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'traffic' && (
        <div style={styles.content}>
          {/* Traffic KPIs */}
          <div style={styles.kpiGrid}>
            <KPICard
              title="Sayfa Görüntüleme"
              value={summary.traffic?.page_views?.toLocaleString('tr-TR') || 0}
              color="#00d9ff"
            />
            <KPICard
              title="Benzersiz Ziyaretçi"
              value={summary.traffic?.unique_visitors?.toLocaleString('tr-TR') || 0}
              color="#7000ff"
            />
          </div>

          {/* Hourly Traffic */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Saatlik Trafik (Son 24 Saat)</h2>
            <div style={styles.chartCard}>
              <div style={styles.hourlyChart}>
                {Array.from({length: 24}, (_, i) => {
                  const hourData = charts.hourly_traffic?.find(h => h.hour === i);
                  const views = hourData?.views || 0;
                  const maxViews = Math.max(...(charts.hourly_traffic?.map(h => h.views) || [1]));
                  return (
                    <div key={i} style={styles.hourBar}>
                      <div
                        style={{
                          ...styles.hourBarFill,
                          height: `${Math.max(5, (views / maxViews) * 100)}%`
                        }}
                        title={`${i}:00 - ${views} görüntüleme`}
                      />
                      <span style={styles.hourLabel}>{i}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Weekly Traffic */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Haftalık Trafik</h2>
            <div style={styles.chartCard}>
              <BarChart
                data={charts.weekly_traffic || []}
                dataKey="views"
                labelKey="date"
                color="#00d9ff"
              />
            </div>
          </div>

          {/* Top Pages */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>En Çok Ziyaret Edilen Sayfalar</h2>
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Sayfa</th>
                    <th style={styles.th}>Görüntüleme</th>
                    <th style={styles.th}>Benzersiz</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.top_pages?.map((page, i) => (
                    <tr key={i}>
                      <td style={styles.td}>{page.path}</td>
                      <td style={styles.td}>{page.views}</td>
                      <td style={styles.td}>{page.unique}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Referrers */}
          {tables.referrers?.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Trafik Kaynakları</h2>
              <div style={styles.tableCard}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Kaynak</th>
                      <th style={styles.th}>Ziyaret</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.referrers?.map((ref, i) => (
                      <tr key={i}>
                        <td style={styles.td}>{ref.source}</td>
                        <td style={styles.td}>{ref.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'courses' && (
        <div style={styles.content}>
          {/* Course KPIs */}
          <div style={styles.kpiGrid}>
            <KPICard title="Toplam Kurs" value={summary.courses?.total_courses || 0} color="#7000ff" />
            <KPICard title="Toplam Ders" value={summary.courses?.total_lessons || 0} color="#00d9ff" />
            <KPICard
              title="İzlenme Süresi"
              value={`${summary.courses?.total_watch_hours || 0} saat`}
              color="#00ff9d"
            />
            <KPICard
              title="Tamamlanan Ders"
              value={summary.courses?.completed_lessons || 0}
              color="#ff9d00"
            />
          </div>

          {/* Popular Lessons */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>En Popüler Dersler</h2>
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Ders</th>
                    <th style={styles.th}>İzleyici</th>
                    <th style={styles.th}>Toplam Süre</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.popular_lessons?.map((lesson, i) => (
                    <tr key={i}>
                      <td style={styles.td}>{lesson.title}</td>
                      <td style={styles.td}>{lesson.watchers}</td>
                      <td style={styles.td}>{lesson.watch_hours} saat</td>
                    </tr>
                  ))}
                  {(!tables.popular_lessons || tables.popular_lessons.length === 0) && (
                    <tr>
                      <td colSpan={3} style={{...styles.td, textAlign: 'center', color: '#666'}}>
                        Henüz izleme verisi yok
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Admin Links */}
      <div style={styles.adminLinks}>
        <Link to="/admin/email-templates" style={styles.adminLink}>
          Email Şablonları →
        </Link>
      </div>
    </div>
  );
}

// Components
function KPICard({ title, value, change, subtitle, color, large }) {
  return (
    <div style={{...styles.kpiCard, ...(large ? styles.kpiCardLarge : {})}}>
      <div style={styles.kpiTitle}>{title}</div>
      <div style={{...styles.kpiValue, color: color || '#fff', fontSize: large ? '3rem' : '2rem'}}>
        {value}
      </div>
      {change !== undefined && (
        <div style={{
          ...styles.kpiChange,
          color: change >= 0 ? '#00ff9d' : '#ff4757'
        }}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </div>
      )}
      {subtitle && <div style={styles.kpiSubtitle}>{subtitle}</div>}
    </div>
  );
}

function FunnelStep({ label, value, rate, width, color }) {
  return (
    <div style={styles.funnelStep}>
      <div style={styles.funnelLabel}>{label}</div>
      <div
        style={{
          ...styles.funnelBar,
          width: `${width}%`,
          backgroundColor: color
        }}
      >
        <span style={styles.funnelValue}>{value.toLocaleString('tr-TR')}</span>
      </div>
      {rate !== undefined && (
        <div style={styles.funnelRate}>%{rate}</div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const statusStyles = {
    success: { bg: 'rgba(0, 255, 157, 0.2)', color: '#00ff9d', text: 'Başarılı' },
    pending: { bg: 'rgba(255, 170, 0, 0.2)', color: '#ffaa00', text: 'Bekliyor' },
    failed: { bg: 'rgba(255, 71, 87, 0.2)', color: '#ff4757', text: 'Başarısız' },
  };
  const s = statusStyles[status] || statusStyles.pending;
  return (
    <span style={{
      padding: '4px 8px',
      borderRadius: '4px',
      backgroundColor: s.bg,
      color: s.color,
      fontSize: '0.75rem',
      fontWeight: '600'
    }}>
      {s.text}
    </span>
  );
}

function BarChart({ data, dataKey, labelKey, color, prefix = '' }) {
  if (!data || data.length === 0) {
    return <div style={styles.noData}>Veri yok</div>;
  }

  const maxValue = Math.max(...data.map(d => d[dataKey] || 0));

  return (
    <div style={styles.barChart}>
      {data.slice(-14).map((item, i) => (
        <div key={i} style={styles.barGroup}>
          <div
            style={{
              ...styles.bar,
              height: `${Math.max(5, ((item[dataKey] || 0) / maxValue) * 150)}px`,
              backgroundColor: color
            }}
            title={`${item[labelKey]}: ${prefix}${item[dataKey]?.toLocaleString('tr-TR') || 0}`}
          />
          <div style={styles.barLabel}>
            {item[labelKey]?.slice(-5)}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    padding: '1.5rem',
    color: '#fff',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  headerLeft: {},
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  backLink: {
    color: '#a0a0a0',
    fontSize: '0.9rem',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '0.5rem',
  },
  pageTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    borderRadius: '2rem',
    fontSize: '0.85rem',
    color: '#00ff9d',
  },
  liveDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#00ff9d',
    animation: 'pulse 2s infinite',
  },
  select: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.5rem',
    color: '#fff',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    overflowX: 'auto',
    paddingBottom: '0.5rem',
  },
  tab: {
    padding: '0.75rem 1.25rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.5rem',
    color: '#a0a0a0',
    fontSize: '0.9rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
  tabActive: {
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    borderColor: '#00ff9d',
    color: '#00ff9d',
  },
  content: {},
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  kpiCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  kpiCardLarge: {
    gridColumn: 'span 2',
  },
  kpiTitle: {
    fontSize: '0.85rem',
    color: '#a0a0a0',
    marginBottom: '0.5rem',
  },
  kpiValue: {
    fontSize: '2rem',
    fontWeight: '700',
  },
  kpiChange: {
    fontSize: '0.85rem',
    marginTop: '0.25rem',
  },
  kpiSubtitle: {
    fontSize: '0.8rem',
    color: '#666',
    marginTop: '0.5rem',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '1rem',
  },
  funnelContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  funnelStep: {
    marginBottom: '1rem',
  },
  funnelLabel: {
    fontSize: '0.85rem',
    color: '#a0a0a0',
    marginBottom: '0.5rem',
  },
  funnelBar: {
    height: '40px',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'width 0.5s',
  },
  funnelValue: {
    color: '#000',
    fontWeight: '700',
    fontSize: '0.9rem',
  },
  funnelRate: {
    fontSize: '0.8rem',
    color: '#666',
    marginTop: '0.25rem',
    textAlign: 'right',
  },
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  tableCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
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
    fontSize: '0.8rem',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    color: '#fff',
    fontSize: '0.85rem',
  },
  badgeSuccess: {
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(0, 255, 157, 0.2)',
    color: '#00ff9d',
    fontSize: '0.75rem',
  },
  badgeWarning: {
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 170, 0, 0.2)',
    color: '#ffaa00',
    fontSize: '0.75rem',
  },
  badgeMuted: {
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#666',
    fontSize: '0.75rem',
  },
  eventGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '1rem',
  },
  eventCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    padding: '1rem',
    textAlign: 'center',
  },
  eventCount: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#fff',
  },
  eventType: {
    fontSize: '0.75rem',
    color: '#a0a0a0',
    marginTop: '0.25rem',
    textTransform: 'capitalize',
  },
  filterBar: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1,
    minWidth: '200px',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.5rem',
    color: '#fff',
    fontSize: '0.9rem',
  },
  successButton: {
    padding: '0.4rem 0.75rem',
    backgroundColor: 'rgba(0, 255, 157, 0.2)',
    border: '1px solid #00ff9d',
    borderRadius: '0.4rem',
    color: '#00ff9d',
    fontSize: '0.75rem',
    cursor: 'pointer',
  },
  dangerButton: {
    padding: '0.4rem 0.75rem',
    backgroundColor: 'rgba(255, 71, 87, 0.2)',
    border: '1px solid #ff4757',
    borderRadius: '0.4rem',
    color: '#ff4757',
    fontSize: '0.75rem',
    cursor: 'pointer',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  pageButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.5rem',
    color: '#fff',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  pageInfo: {
    color: '#a0a0a0',
    fontSize: '0.85rem',
  },
  chartCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  barChart: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '180px',
    gap: '0.25rem',
  },
  barGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    maxWidth: '40px',
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.3s',
  },
  barLabel: {
    fontSize: '0.6rem',
    color: '#666',
    marginTop: '0.5rem',
    transform: 'rotate(-45deg)',
    whiteSpace: 'nowrap',
  },
  noData: {
    textAlign: 'center',
    color: '#666',
    padding: '2rem',
  },
  hourlyChart: {
    display: 'flex',
    alignItems: 'flex-end',
    height: '150px',
    gap: '2px',
  },
  hourBar: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  hourBarFill: {
    width: '100%',
    backgroundColor: '#00d9ff',
    borderRadius: '2px 2px 0 0',
    transition: 'height 0.3s',
  },
  hourLabel: {
    fontSize: '0.6rem',
    color: '#666',
    marginTop: '4px',
  },
  statusCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
  },
  statusCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '2px solid',
    borderRadius: '1rem',
    padding: '1.5rem',
    textAlign: 'center',
  },
  statusIcon: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  statusValue: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#fff',
  },
  statusLabel: {
    fontSize: '0.85rem',
    color: '#a0a0a0',
    marginTop: '0.25rem',
  },
  adminLinks: {
    marginTop: '3rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    gap: '1rem',
  },
  adminLink: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(112, 0, 255, 0.1)',
    border: '1px solid rgba(112, 0, 255, 0.3)',
    borderRadius: '0.5rem',
    color: '#a78bfa',
    textDecoration: 'none',
    fontSize: '0.9rem',
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
    fontSize: '0.9rem',
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
  primaryButton: {
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
};

// Add CSS animation for live dot
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);
