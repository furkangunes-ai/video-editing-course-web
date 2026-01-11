import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Send, Edit2, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://videomaster-backend-production.up.railway.app';

export function Reviews({ courseId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    average_rating: 0,
    total: 0,
    rating_distribution: {}
  });
  const [loading, setLoading] = useState(true);
  const [myReview, setMyReview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReviews();
    fetchMyReview();
  }, [courseId, page]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/reviews/course/${courseId}?page=${page}&limit=10`,
        { headers: getAuthHeaders() }
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
        setStats({
          average_rating: data.average_rating,
          total: data.total,
          rating_distribution: data.rating_distribution
        });
        setTotalPages(data.total_pages);
      }
    } catch (err) {
      console.error('Reviews fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyReview = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/reviews/my-review/${courseId}`,
        { headers: getAuthHeaders() }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.review) {
          setMyReview(data.review);
          setFormData({
            rating: data.review.rating,
            title: data.review.title || '',
            content: data.review.content
          });
        }
      }
    } catch (err) {
      console.error('My review fetch error:', err);
    }
  };

  const submitReview = async () => {
    if (!formData.content.trim()) {
      setError('Yorum içeriği boş olamaz');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/reviews/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          course_id: courseId,
          ...formData
        })
      });

      if (response.ok) {
        setSuccess('Yorumunuz eklendi!');
        setShowForm(false);
        fetchReviews();
        fetchMyReview();
      } else {
        const data = await response.json();
        setError(data.detail || 'Yorum eklenemedi');
      }
    } catch (err) {
      setError('Bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  const updateReview = async () => {
    if (!myReview) return;

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/reviews/${myReview.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess('Yorumunuz güncellendi!');
        setShowForm(false);
        fetchReviews();
        fetchMyReview();
      } else {
        const data = await response.json();
        setError(data.detail || 'Güncelleme başarısız');
      }
    } catch (err) {
      setError('Bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async () => {
    if (!myReview || !confirm('Yorumunuzu silmek istediğinize emin misiniz?')) return;

    try {
      const response = await fetch(`${API_URL}/api/reviews/${myReview.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setSuccess('Yorumunuz silindi');
        setMyReview(null);
        setFormData({ rating: 5, title: '', content: '' });
        fetchReviews();
      }
    } catch (err) {
      setError('Silme başarısız');
    }
  };

  const markHelpful = async (reviewId) => {
    try {
      const response = await fetch(`${API_URL}/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        fetchReviews();
      }
    } catch (err) {
      console.error('Helpful mark error:', err);
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div style={styles.stars}>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={interactive ? 28 : 16}
            fill={star <= rating ? '#ffc107' : 'transparent'}
            color={star <= rating ? '#ffc107' : '#444'}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              transition: 'all 0.2s'
            }}
            onClick={() => interactive && onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div style={styles.loading}>Yorumlar yükleniyor...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header with Stats */}
      <div style={styles.header}>
        <h2 style={styles.title}>Öğrenci Yorumları</h2>
        <div style={styles.statsRow}>
          <div style={styles.averageRating}>
            <span style={styles.ratingNumber}>{stats.average_rating.toFixed(1)}</span>
            {renderStars(Math.round(stats.average_rating))}
            <span style={styles.totalReviews}>({stats.total} yorum)</span>
          </div>

          {/* Rating Distribution */}
          <div style={styles.distribution}>
            {[5, 4, 3, 2, 1].map(rating => {
              const count = stats.rating_distribution[rating] || 0;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={rating} style={styles.distributionRow}>
                  <span style={styles.distributionLabel}>{rating}</span>
                  <Star size={12} fill="#ffc107" color="#ffc107" />
                  <div style={styles.distributionBar}>
                    <div
                      style={{
                        ...styles.distributionFill,
                        width: `${percentage}%`
                      }}
                    />
                  </div>
                  <span style={styles.distributionCount}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      {/* Write Review Button / Form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          style={styles.writeButton}
        >
          {myReview ? <Edit2 size={18} /> : <Send size={18} />}
          {myReview ? 'Yorumumu Düzenle' : 'Yorum Yaz'}
        </button>
      ) : (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>
            {myReview ? 'Yorumunu Düzenle' : 'Yorum Yaz'}
          </h3>

          <div style={styles.formGroup}>
            <label style={styles.label}>Puanınız</label>
            {renderStars(formData.rating, true, (rating) =>
              setFormData({ ...formData, rating })
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Başlık (Opsiyonel)</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={styles.input}
              placeholder="Kısa bir başlık..."
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Yorumunuz</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              style={styles.textarea}
              placeholder="Kurs hakkındaki düşüncelerinizi paylaşın..."
              rows={4}
            />
          </div>

          <div style={styles.formActions}>
            {myReview && (
              <button onClick={deleteReview} style={styles.deleteButton}>
                <Trash2 size={16} /> Sil
              </button>
            )}
            <button onClick={() => setShowForm(false)} style={styles.cancelButton}>
              İptal
            </button>
            <button
              onClick={myReview ? updateReview : submitReview}
              disabled={submitting}
              style={styles.submitButton}
            >
              {submitting ? 'Gönderiliyor...' : (myReview ? 'Güncelle' : 'Gönder')}
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div style={styles.reviewsList}>
        {reviews.length === 0 ? (
          <div style={styles.emptyState}>
            Henüz yorum yapılmamış. İlk yorumu sen yap!
          </div>
        ) : (
          reviews.map(review => (
            <div
              key={review.id}
              style={{
                ...styles.reviewCard,
                ...(review.is_own ? styles.ownReview : {})
              }}
            >
              <div style={styles.reviewHeader}>
                <div style={styles.reviewUser}>
                  <div style={styles.avatar}>
                    {review.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span style={styles.userName}>{review.user_name}</span>
                    {review.is_own && (
                      <span style={styles.ownBadge}>Sizin yorumunuz</span>
                    )}
                    <div style={styles.reviewMeta}>
                      {renderStars(review.rating)}
                      <span style={styles.reviewDate}>
                        {new Date(review.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {review.title && (
                <h4 style={styles.reviewTitle}>{review.title}</h4>
              )}
              <p style={styles.reviewContent}>{review.content}</p>

              <div style={styles.reviewFooter}>
                <button
                  onClick={() => markHelpful(review.id)}
                  style={styles.helpfulButton}
                  disabled={review.is_own}
                >
                  <ThumbsUp size={14} />
                  Faydalı ({review.helpful_count})
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            style={styles.pageButton}
          >
            Önceki
          </button>
          <span style={styles.pageInfo}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            style={styles.pageButton}
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#fff',
  },
  statsRow: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  averageRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  ratingNumber: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#ffc107',
  },
  stars: {
    display: 'flex',
    gap: '0.25rem',
  },
  totalReviews: {
    color: '#666',
    fontSize: '0.9rem',
  },
  distribution: {
    flex: 1,
    minWidth: '200px',
  },
  distributionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.25rem',
  },
  distributionLabel: {
    width: '15px',
    color: '#a0a0a0',
    fontSize: '0.85rem',
  },
  distributionBar: {
    flex: 1,
    height: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  distributionFill: {
    height: '100%',
    backgroundColor: '#ffc107',
    borderRadius: '4px',
  },
  distributionCount: {
    width: '30px',
    color: '#666',
    fontSize: '0.8rem',
    textAlign: 'right',
  },
  error: {
    backgroundColor: 'rgba(255, 77, 87, 0.1)',
    border: '1px solid #ff4d57',
    color: '#ff4d57',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  success: {
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    border: '1px solid #00ff9d',
    color: '#00ff9d',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  writeButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    border: '1px solid rgba(0, 255, 157, 0.3)',
    color: '#00ff9d',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '500',
    marginBottom: '2rem',
  },
  formCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  formTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#fff',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#a0a0a0',
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.5rem',
    color: '#fff',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.5rem',
    color: '#fff',
    fontSize: '1rem',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '1rem',
  },
  submitButton: {
    backgroundColor: '#00ff9d',
    color: '#000',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    color: '#a0a0a0',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
  deleteButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(255, 77, 87, 0.1)',
    color: '#ff4d57',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    marginRight: 'auto',
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '1rem',
  },
  reviewCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  ownReview: {
    borderColor: 'rgba(0, 255, 157, 0.3)',
    backgroundColor: 'rgba(0, 255, 157, 0.05)',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  reviewUser: {
    display: 'flex',
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
    fontSize: '1.1rem',
  },
  userName: {
    fontWeight: '500',
    color: '#fff',
    display: 'block',
  },
  ownBadge: {
    backgroundColor: 'rgba(0, 255, 157, 0.2)',
    color: '#00ff9d',
    padding: '0.2rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.7rem',
    marginLeft: '0.5rem',
  },
  reviewMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '0.25rem',
  },
  reviewDate: {
    color: '#666',
    fontSize: '0.8rem',
  },
  reviewTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#fff',
  },
  reviewContent: {
    color: '#a0a0a0',
    lineHeight: '1.6',
    marginBottom: '1rem',
  },
  reviewFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  helpfulButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#666',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem',
  },
  pageButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
  pageInfo: {
    color: '#666',
    fontSize: '0.9rem',
  },
};

export default Reviews;
