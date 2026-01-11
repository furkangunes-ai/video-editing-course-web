import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, GripVertical, Video, FileQuestion, ChevronDown } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://videomaster-backend-production.up.railway.app';

export function AdminContentOrder() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courseId) {
      setSelectedCourse(parseInt(courseId));
      fetchContents(courseId);
    }
  }, [courseId]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/courses/admin`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
        if (data.length > 0 && !courseId) {
          setSelectedCourse(data[0].id);
          fetchContents(data[0].id);
        }
      }
    } catch (err) {
      setError('Kurslar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchContents = async (cId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/quizzes/admin/course/${cId}/contents`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setContents(data);
        setHasChanges(false);
      }
    } catch (err) {
      setError('İçerikler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const cId = parseInt(e.target.value);
    setSelectedCourse(cId);
    navigate(`/admin/content-order/${cId}`);
    fetchContents(cId);
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) return;

    const newContents = [...contents];
    const draggedContent = newContents[draggedItem];

    // Remove dragged item
    newContents.splice(draggedItem, 1);
    // Insert at new position
    newContents.splice(dropIndex, 0, draggedContent);

    // Update order values
    const updatedContents = newContents.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));

    setContents(updatedContents);
    setHasChanges(true);
    setDraggedItem(null);
  };

  const saveOrder = async () => {
    setSaving(true);
    setError('');
    try {
      const orderData = contents.map((item, idx) => ({
        content_type: item.content_type,
        content_id: item.content_id,
        order: idx + 1
      }));

      const response = await fetch(`${API_URL}/api/quizzes/admin/course/${selectedCourse}/contents/reorder`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ contents: orderData })
      });

      if (response.ok) {
        setSuccess('Sıralama kaydedildi!');
        setHasChanges(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const err = await response.json();
        setError(err.detail || 'Kaydetme başarısız');
      }
    } catch (err) {
      setError('Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const moveItem = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= contents.length) return;

    const newContents = [...contents];
    const item = newContents[fromIndex];
    newContents.splice(fromIndex, 1);
    newContents.splice(toIndex, 0, item);

    const updatedContents = newContents.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));

    setContents(updatedContents);
    setHasChanges(true);
  };

  if (loading && !contents.length) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Yükleniyor...</div>
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
        <h1 style={styles.title}>Icerik Siralamasi</h1>
      </div>

      {/* Messages */}
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      {/* Course Selector */}
      <div style={styles.courseSelector}>
        <label style={styles.label}>Kurs Secin:</label>
        <div style={styles.selectWrapper}>
          <select
            value={selectedCourse || ''}
            onChange={handleCourseChange}
            style={styles.select}
          >
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <ChevronDown size={20} style={styles.selectIcon} />
        </div>
      </div>

      {/* Content List */}
      <div style={styles.contentCard}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>
            Icerikler ({contents.length})
          </h2>
          {hasChanges && (
            <button
              onClick={saveOrder}
              disabled={saving}
              style={styles.saveButton}
            >
              <Save size={16} />
              {saving ? 'Kaydediliyor...' : 'Siralamayi Kaydet'}
            </button>
          )}
        </div>

        <p style={styles.helpText}>
          Icerikleri surukleyerek siralayin. Ogrenciler bu sirada gorur.
        </p>

        {contents.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Bu kursta henuz icerik yok.</p>
            <p style={styles.emptyHint}>
              Ders ve quiz eklemek icin ilgili admin sayfalarini kullanin.
            </p>
          </div>
        ) : (
          <div style={styles.contentList}>
            {contents.map((item, index) => (
              <div
                key={`${item.content_type}-${item.content_id}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                style={{
                  ...styles.contentItem,
                  ...(draggedItem === index ? styles.contentItemDragging : {})
                }}
              >
                <div style={styles.dragHandle}>
                  <GripVertical size={20} />
                </div>

                <div style={styles.orderNumber}>{index + 1}</div>

                <div style={{
                  ...styles.contentIcon,
                  backgroundColor: item.content_type === 'lesson'
                    ? 'rgba(0, 217, 255, 0.2)'
                    : 'rgba(112, 0, 255, 0.2)',
                  color: item.content_type === 'lesson' ? '#00d9ff' : '#7000ff'
                }}>
                  {item.content_type === 'lesson' ? (
                    <Video size={20} />
                  ) : (
                    <FileQuestion size={20} />
                  )}
                </div>

                <div style={styles.contentInfo}>
                  <span style={styles.contentTitle}>{item.title}</span>
                  <span style={styles.contentMeta}>
                    <span style={{
                      ...styles.typeBadge,
                      backgroundColor: item.content_type === 'lesson'
                        ? 'rgba(0, 217, 255, 0.1)'
                        : 'rgba(112, 0, 255, 0.1)',
                      color: item.content_type === 'lesson' ? '#00d9ff' : '#7000ff'
                    }}>
                      {item.content_type === 'lesson' ? 'Video' : 'Quiz'}
                    </span>
                    {item.content_type === 'lesson' && item.duration_seconds && (
                      <span style={styles.duration}>
                        {Math.floor(item.duration_seconds / 60)} dk
                      </span>
                    )}
                    {item.content_type === 'quiz' && (
                      <span style={styles.questionCount}>
                        {item.question_count || 0} soru
                      </span>
                    )}
                  </span>
                </div>

                <div style={styles.moveButtons}>
                  <button
                    onClick={() => moveItem(index, index - 1)}
                    disabled={index === 0}
                    style={{
                      ...styles.moveButton,
                      opacity: index === 0 ? 0.3 : 1
                    }}
                    title="Yukari Tasi"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveItem(index, index + 1)}
                    disabled={index === contents.length - 1}
                    style={{
                      ...styles.moveButton,
                      opacity: index === contents.length - 1 ? 0.3 : 1
                    }}
                    title="Asagi Tasi"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div style={styles.infoCard}>
        <h3 style={styles.infoTitle}>Nasil Calisir?</h3>
        <ul style={styles.infoList}>
          <li>Video ve quizler bu sirada ogrencilere gosterilir</li>
          <li>Icerikleri surukleyerek veya ok tuslarıyla siralayin</li>
          <li>Degisiklikleri kaydetmeyi unutmayin</li>
          <li>Yeni ders veya quiz eklemek icin ilgili admin sayfalarini kullanin</li>
        </ul>
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
    background: 'linear-gradient(135deg, #00d9ff 0%, #7000ff 100%)',
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
  courseSelector: {
    marginBottom: '2rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#a0a0a0',
    fontSize: '0.9rem',
  },
  selectWrapper: {
    position: 'relative',
    maxWidth: '400px',
  },
  select: {
    width: '100%',
    padding: '0.75rem 2.5rem 0.75rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.5rem',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    appearance: 'none',
  },
  selectIcon: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666',
    pointerEvents: 'none',
  },
  contentCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: 0,
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#00ff9d',
    color: '#000',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  helpText: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
  },
  emptyHint: {
    fontSize: '0.85rem',
    marginTop: '0.5rem',
  },
  contentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  contentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    cursor: 'grab',
    transition: 'all 0.2s',
  },
  contentItemDragging: {
    opacity: 0.5,
    border: '1px dashed rgba(0, 217, 255, 0.5)',
    backgroundColor: 'rgba(0, 217, 255, 0.05)',
  },
  dragHandle: {
    color: '#444',
    cursor: 'grab',
    padding: '0.25rem',
  },
  orderNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    fontWeight: '600',
    flexShrink: 0,
  },
  contentIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  contentInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    minWidth: 0,
  },
  contentTitle: {
    fontSize: '1rem',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  contentMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.85rem',
  },
  typeBadge: {
    padding: '0.2rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  duration: {
    color: '#666',
  },
  questionCount: {
    color: '#666',
  },
  moveButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  moveButton: {
    width: '28px',
    height: '28px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '0.25rem',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  infoCard: {
    backgroundColor: 'rgba(112, 0, 255, 0.1)',
    border: '1px solid rgba(112, 0, 255, 0.2)',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  infoTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#a78bfa',
  },
  infoList: {
    margin: 0,
    paddingLeft: '1.25rem',
    color: '#a0a0a0',
    fontSize: '0.9rem',
    lineHeight: '1.8',
  },
};

export default AdminContentOrder;
