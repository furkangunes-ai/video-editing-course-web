import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, GripVertical, Video, FileQuestion, ChevronDown, Edit2, Trash2, AlertTriangle, ShieldAlert, X } from 'lucide-react';

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
  const [editLessonModal, setEditLessonModal] = useState(null);
  const [deleteContentModal, setDeleteContentModal] = useState(null);
  const [deleteCourseModal, setDeleteCourseModal] = useState(false);

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
    } catch {
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
    } catch {
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

    newContents.splice(draggedItem, 1);
    newContents.splice(dropIndex, 0, draggedContent);

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
        flashSuccess('Sıralama kaydedildi!');
        setHasChanges(false);
      } else {
        const err = await response.json();
        setError(err.detail || 'Kaydetme başarısız');
      }
    } catch {
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

  const flashSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const saveLessonEdit = async (lessonId, patch) => {
    setError('');
    const response = await fetch(`${API_URL}/api/courses/admin/lesson/${lessonId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(patch),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      setError(err.detail || 'Ders güncellenemedi');
      return false;
    }
    flashSuccess('Ders güncellendi.');
    setEditLessonModal(null);
    fetchContents(selectedCourse);
    return true;
  };

  const deleteContent = async (content) => {
    setError('');
    const endpoint =
      content.content_type === 'lesson'
        ? `${API_URL}/api/courses/admin/lesson/${content.content_id}`
        : `${API_URL}/api/quizzes/admin/${content.content_id}`;
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      setError(err.detail || 'Silinemedi');
      return;
    }
    flashSuccess(content.content_type === 'lesson' ? 'Ders silindi.' : 'Quiz silindi.');
    setDeleteContentModal(null);
    fetchContents(selectedCourse);
  };

  const deleteCourseConfirmed = async () => {
    setError('');
    const response = await fetch(`${API_URL}/api/courses/admin/course/${selectedCourse}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      setError(err.detail || 'Kurs silinemedi');
      return;
    }
    flashSuccess('Kurs silindi.');
    setDeleteCourseModal(false);
    setSelectedCourse(null);
    setContents([]);
    fetchCourses();
    navigate('/admin/content-order');
  };

  const currentCourseTitle = courses.find((c) => c.id === selectedCourse)?.title || '';

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
        <h1 style={styles.title}>İçerik Sıralaması</h1>
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <div style={styles.courseSelector}>
        <label style={styles.label}>Kurs seçin:</label>
        <div style={styles.selectRow}>
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
          {selectedCourse && (
            <button
              type="button"
              onClick={() => setDeleteCourseModal(true)}
              style={styles.dangerButton}
              title="Kursu tamamen sil"
            >
              <Trash2 size={16} /> Kursu Sil
            </button>
          )}
        </div>
      </div>

      <div style={styles.contentCard}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>
            İçerikler ({contents.length})
          </h2>
          {hasChanges && (
            <button onClick={saveOrder} disabled={saving} style={styles.saveButton}>
              <Save size={16} />
              {saving ? 'Kaydediliyor...' : 'Sıralamayı Kaydet'}
            </button>
          )}
        </div>

        <p style={styles.helpText}>
          İçerikleri sürükleyerek veya ↑↓ tuşlarıyla sıralayın. Düzenleme ve silme butonlarıyla içeriği yönetin.
        </p>

        {contents.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Bu kursta henüz içerik yok.</p>
            <p style={styles.emptyHint}>
              Ders eklemek için Admin Hub → "Ders Ekle", quiz eklemek için "Quiz Oluştur" sayfasını kullanın.
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
                    {item.content_type === 'lesson' && item.duration_seconds ? (
                      <span style={styles.duration}>
                        {Math.floor(item.duration_seconds / 60)} dk
                      </span>
                    ) : null}
                    {item.content_type === 'quiz' && (
                      <span style={styles.questionCount}>
                        {item.question_count || 0} soru
                      </span>
                    )}
                  </span>
                </div>

                <div style={styles.itemActions}>
                  {item.content_type === 'lesson' && (
                    <button
                      onClick={() => setEditLessonModal({ ...item })}
                      style={styles.iconButton}
                      title="Dersi düzenle"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteContentModal(item)}
                    style={{ ...styles.iconButton, ...styles.iconButtonDanger }}
                    title="Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={styles.moveButtons}>
                  <button
                    onClick={() => moveItem(index, index - 1)}
                    disabled={index === 0}
                    style={{
                      ...styles.moveButton,
                      opacity: index === 0 ? 0.3 : 1
                    }}
                    title="Yukarı taşı"
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
                    title="Aşağı taşı"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.infoCard}>
        <h3 style={styles.infoTitle}>İpuçları</h3>
        <ul style={styles.infoList}>
          <li>Yeni Bunny.net videosu çıktığında: ders satırının "Düzenle" butonundan video URL'sini güncelle — öğrenci ilerlemesi korunur.</li>
          <li>Bir dersi silmek = bağlı tüm öğrenci ilerlemesi kalıcı olarak silinir (cascade).</li>
          <li>Kurs silme işlemi cascade ile dersler, quizler, erişim kayıtları ve ilerlemeleri de siler. Geri alınamaz.</li>
        </ul>
      </div>

      {editLessonModal && (
        <EditLessonModal
          lesson={editLessonModal}
          onSave={saveLessonEdit}
          onClose={() => setEditLessonModal(null)}
        />
      )}

      {deleteContentModal && (
        <ConfirmDeleteModal
          title={`"${deleteContentModal.title}" silinsin mi?`}
          warning={
            deleteContentModal.content_type === 'lesson'
              ? 'Bu dersi izlemiş öğrencilerin ilerleme kayıtları da silinecek.'
              : 'Quizi çözmüş öğrencilerin deneme kayıtları da silinecek.'
          }
          onConfirm={() => deleteContent(deleteContentModal)}
          onClose={() => setDeleteContentModal(null)}
        />
      )}

      {deleteCourseModal && (
        <DeleteCourseModal
          courseTitle={currentCourseTitle}
          onConfirm={deleteCourseConfirmed}
          onClose={() => setDeleteCourseModal(false)}
        />
      )}
    </div>
  );
}

function EditLessonModal({ lesson, onSave, onClose }) {
  const [title, setTitle] = useState(lesson.title || '');
  const [description, setDescription] = useState(lesson.description || '');
  const [videoUrl, setVideoUrl] = useState(lesson.video_url || '');
  const [durationMinutes, setDurationMinutes] = useState(
    lesson.duration_seconds ? Math.round(lesson.duration_seconds / 60) : 0
  );
  const [isFree, setIsFree] = useState(!!lesson.is_free);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSave(lesson.content_id, {
      title,
      description,
      video_url: videoUrl,
      duration_seconds: Math.max(0, Number(durationMinutes) || 0) * 60,
      is_free: isFree,
    });
    setSubmitting(false);
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <form onSubmit={handleSubmit} style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Dersi Düzenle</h3>
          <button type="button" onClick={onClose} style={styles.modalClose} aria-label="Kapat">
            <X size={18} />
          </button>
        </div>
        <div style={styles.modalBody}>
          <label style={styles.formLabel}>Başlık</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.formInput}
            required
          />

          <label style={styles.formLabel}>Açıklama</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...styles.formInput, minHeight: 70 }}
            rows={3}
          />

          <label style={styles.formLabel}>Video URL (Bunny.net iframe URL veya direct link)</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            style={styles.formInput}
            placeholder="https://iframe.mediadelivery.net/embed/..."
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={styles.formLabel}>Süre (dk)</label>
              <input
                type="number"
                min={0}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                style={styles.formInput}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 6 }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                />
                <span style={{ fontSize: '0.9rem' }}>Ücretsiz önizleme</span>
              </label>
            </div>
          </div>
        </div>
        <div style={styles.modalFooter}>
          <button type="button" onClick={onClose} style={styles.modalCancel}>İptal</button>
          <button type="submit" disabled={submitting} style={styles.modalSubmit}>
            {submitting ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}

function ConfirmDeleteModal({ title, warning, onConfirm, onClose }) {
  const [submitting, setSubmitting] = useState(false);
  const handle = async () => {
    setSubmitting(true);
    await onConfirm();
    setSubmitting(false);
  };
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={18} color="#ff8a4d" />
            Silme Onayı
          </h3>
          <button type="button" onClick={onClose} style={styles.modalClose} aria-label="Kapat">
            <X size={18} />
          </button>
        </div>
        <div style={styles.modalBody}>
          <p style={{ margin: '0 0 0.75rem', fontWeight: 600 }}>{title}</p>
          <p style={{ margin: 0, color: '#a0a0a0', fontSize: '0.9rem' }}>{warning}</p>
        </div>
        <div style={styles.modalFooter}>
          <button type="button" onClick={onClose} style={styles.modalCancel}>Vazgeç</button>
          <button type="button" onClick={handle} disabled={submitting} style={styles.modalDanger}>
            {submitting ? 'Siliniyor...' : 'Evet, sil'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteCourseModal({ courseTitle, onConfirm, onClose }) {
  const [typed, setTyped] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const matches = typed.trim() === courseTitle.trim();

  const handle = async (e) => {
    e.preventDefault();
    if (!matches) return;
    setSubmitting(true);
    await onConfirm();
    setSubmitting(false);
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <form onSubmit={handle} style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <ShieldAlert size={18} color="#ff4d57" />
            Kurs silinecek — geri alınamaz
          </h3>
          <button type="button" onClick={onClose} style={styles.modalClose} aria-label="Kapat">
            <X size={18} />
          </button>
        </div>
        <div style={styles.modalBody}>
          <p style={{ marginTop: 0 }}>
            <strong>{courseTitle}</strong> kursunu, içindeki tüm dersleri, quizleri, öğrenci ilerlemelerini ve erişim kayıtlarını silmek üzeresin. Bu işlem geri alınamaz.
          </p>
          <p style={{ marginBottom: '0.5rem', color: '#a0a0a0', fontSize: '0.9rem' }}>
            Onaylamak için kurs adını birebir aşağıya yaz:
          </p>
          <input
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={courseTitle}
            style={styles.formInput}
            autoFocus
          />
        </div>
        <div style={styles.modalFooter}>
          <button type="button" onClick={onClose} style={styles.modalCancel}>Vazgeç</button>
          <button
            type="submit"
            disabled={!matches || submitting}
            style={{ ...styles.modalDanger, opacity: matches ? 1 : 0.4, cursor: matches ? 'pointer' : 'not-allowed' }}
          >
            {submitting ? 'Siliniyor...' : 'Kursu sil'}
          </button>
        </div>
      </form>
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
  selectRow: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  selectWrapper: {
    position: 'relative',
    maxWidth: '400px',
    flex: '1 1 280px',
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
  dangerButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.6rem 1rem',
    background: 'rgba(255, 77, 87, 0.1)',
    border: '1px solid rgba(255, 77, 87, 0.4)',
    borderRadius: '0.5rem',
    color: '#ff4d57',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
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
  itemActions: {
    display: 'flex',
    gap: '0.35rem',
  },
  iconButton: {
    width: '32px',
    height: '32px',
    borderRadius: '0.4rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    color: '#a0a0a0',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  },
  iconButtonDanger: {
    color: '#ff7a87',
    borderColor: 'rgba(255, 77, 87, 0.35)',
    backgroundColor: 'rgba(255, 77, 87, 0.08)',
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

  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    background: '#141414',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '0.85rem',
    color: '#fff',
    overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  modalClose: {
    background: 'none',
    border: 'none',
    color: '#a0a0a0',
    cursor: 'pointer',
    padding: 4,
  },
  modalBody: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    padding: '0.85rem 1.25rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  formLabel: {
    fontSize: '0.8rem',
    color: '#a0a0a0',
    marginTop: '0.5rem',
    marginBottom: '0.25rem',
  },
  formInput: {
    width: '100%',
    padding: '0.65rem 0.85rem',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '0.5rem',
    color: '#fff',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  },
  modalCancel: {
    padding: '0.6rem 1.1rem',
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '0.5rem',
    color: '#a0a0a0',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  modalSubmit: {
    padding: '0.6rem 1.2rem',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    border: 'none',
    borderRadius: '0.5rem',
    color: '#000',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  modalDanger: {
    padding: '0.6rem 1.2rem',
    background: 'linear-gradient(135deg, #ff4d57 0%, #cc0000 100%)',
    border: 'none',
    borderRadius: '0.5rem',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
};

export default AdminContentOrder;
