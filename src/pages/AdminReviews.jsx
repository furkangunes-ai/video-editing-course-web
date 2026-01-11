import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Check, X, Trash2, Eye, EyeOff, Search, Filter } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://videomaster-api.up.railway.app';

export function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, approved, hidden
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    hidden: 0,
    averageRating: 0
  });

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const url = filter === 'all'
        ? `${API_URL}/api/reviews/admin/`
        : `${API_URL}/api/reviews/admin/?status=${filter}`;

      const response = await fetch(url, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
        setStats(data.stats || {
          total: data.reviews?.length || 0,
          approved: 0,
          pending: 0,
          hidden: 0,
          averageRating: 0
        });
      }
    } catch (err) {
      setError('Yorumlar yuklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (reviewId, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/reviews/admin/${reviewId}/approve`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_approved: !currentStatus })
      });

      if (response.ok) {
        setSuccess(currentStatus ? 'Yorum onay kaldirildi' : 'Yorum onaylandi');
        fetchReviews();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Islem basarisiz');
    }
  };

  const toggleVisibility = async (reviewId, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/reviews/admin/${reviewId}/visibility`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_visible: !currentStatus })
      });

      if (response.ok) {
        setSuccess(currentStatus ? 'Yorum gizlendi' : 'Yorum gorunur yapildi');
        fetchReviews();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Islem basarisiz');
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm('Bu yorumu silmek istediginize emin misiniz?')) return;

    try {
      const response = await fetch(`${API_URL}/api/reviews/admin/${reviewId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setSuccess('Yorum silindi');
        fetchReviews();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Silme basarisiz');
    }
  };

  const renderStars = (rating) => {
    return (
      <div style={styles.stars}>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={16}
            fill={star <= rating ? '#fbbf24' : 'transparent'}
            color={star <= rating ? '#fbbf24' : '#444'}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter(review => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      review.user_name?.toLowerCase().includes(search) ||
      review.content?.toLowerCase().includes(search) ||
      review.title?.toLowerCase().includes(search)
    );
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && reviews.length === 0) {
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
        <h1 style={styles.title}>Yorum Yonetimi</h1>
      </div>

      {/* Messages */}
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.total}</div>
          <div style={styles.statLabel}>Toplam Yorum</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#00ff9d' }}>{stats.approved}</div>
          <div style={styles.statLabel}>Onaylı</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#fbbf24' }}>{stats.pending}</div>
          <div style={styles.statLabel}>Bekleyen</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#ff4d57' }}>{stats.hidden}</div>
          <div style={styles.statLabel}>Gizli</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {stats.averageRating?.toFixed(1) || '0.0'}
            <Star size={20} fill="#fbbf24" color="#fbbf24" style={{ marginLeft: '4px' }} />
          </div>
          <div style={styles.statLabel}>Ortalama Puan</div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filtersSection}>
        <div style={styles.searchBox}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Yorum veya kullanici ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterButtons}>
          {[
            { key: 'all', label: 'Tumu' },
            { key: 'pending', label: 'Bekleyen' },
            { key: 'approved', label: 'Onayli' },
            { key: 'hidden', label: 'Gizli' }
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
      </div>

      {/* Reviews List */}
      <div style={styles.reviewsList}>
        {filteredReviews.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Henuz yorum bulunmuyor.</p>
          </div>
        ) : (
          filteredReviews.map(review => (
            <div key={review.id} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <div style={styles.reviewUser}>
                  <div style={styles.avatar}>
                    {review.user_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div style={styles.userInfo}>
                    <span style={styles.userName}>{review.user_name || 'Anonim'}</span>
                    <span style={styles.userEmail}>{review.user_email}</span>
                  </div>
                </div>

                <div style={styles.reviewMeta}>
                  {renderStars(review.rating)}
                  <span style={styles.reviewDate}>{formatDate(review.created_at)}</span>
                </div>
              </div>

              {review.title && (
                <h3 style={styles.reviewTitle}>{review.title}</h3>
              )}

              <p style={styles.reviewContent}>{review.content}</p>

              <div style={styles.reviewFooter}>
                <div style={styles.badges}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: review.is_approved ? 'rgba(0, 255, 157, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                    color: review.is_approved ? '#00ff9d' : '#fbbf24'
                  }}>
                    {review.is_approved ? 'Onayli' : 'Bekliyor'}
                  </span>
                  {!review.is_visible && (
                    <span style={{
                      ...styles.badge,
                      backgroundColor: 'rgba(255, 77, 87, 0.2)',
                      color: '#ff4d57'
                    }}>
                      Gizli
                    </span>
                  )}
                  <span style={styles.helpfulCount}>
                    {review.helpful_count || 0} kisi faydali buldu
                  </span>
                </div>

                <div style={styles.actions}>
                  <button
                    onClick={() => toggleApproval(review.id, review.is_approved)}
                    style={{
                      ...styles.actionButton,
                      backgroundColor: review.is_approved ? 'rgba(255, 77, 87, 0.2)' : 'rgba(0, 255, 157, 0.2)',
                      color: review.is_approved ? '#ff4d57' : '#00ff9d'
                    }}
                    title={review.is_approved ? 'Onayi Kaldir' : 'Onayla'}
                  >
                    {review.is_approved ? <X size={16} /> : <Check size={16} />}
                    {review.is_approved ? 'Reddet' : 'Onayla'}
                  </button>

                  <button
                    onClick={() => toggleVisibility(review.id, review.is_visible)}
                    style={{
                      ...styles.actionButton,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                    title={review.is_visible ? 'Gizle' : 'Goster'}
                  >
                    {review.is_visible ? <EyeOff size={16} /> : <Eye size={16} />}
                    {review.is_visible ? 'Gizle' : 'Goster'}
                  </button>

                  <button
                    onClick={() => deleteReview(review.id)}
                    style={{
                      ...styles.actionButton,
                      backgroundColor: 'rgba(255, 77, 87, 0.2)',
                      color: '#ff4d57'
                    }}
                    title="Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
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
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#666',
    marginTop: '0.5rem',
  },
  filtersSection: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '2rem',
    alignItems: 'center',
  },
  searchBox: {
    position: 'relative',
    flex: '1',
    minWidth: '250px',
    maxWidth: '400px',
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
    backgroundColor: 'rgba(0, 217, 255, 0.2)',
    borderColor: 'rgba(0, 217, 255, 0.3)',
    color: '#00d9ff',
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem',
    color: '#666',
  },
  reviewCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  reviewUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 217, 255, 0.2)',
    color: '#00d9ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '1rem',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontWeight: '500',
  },
  userEmail: {
    fontSize: '0.8rem',
    color: '#666',
  },
  reviewMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.25rem',
  },
  stars: {
    display: 'flex',
    gap: '2px',
  },
  reviewDate: {
    fontSize: '0.8rem',
    color: '#666',
  },
  reviewTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  reviewContent: {
    color: '#c0c0c0',
    lineHeight: '1.6',
    marginBottom: '1rem',
  },
  reviewFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  badges: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  helpfulCount: {
    fontSize: '0.8rem',
    color: '#666',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '500',
    color: '#fff',
    transition: 'opacity 0.2s',
  },
};

export default AdminReviews;
