import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft, GripVertical, Check, X, Edit2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://videomaster-api.up.railway.app';

export function AdminQuizBuilder() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Quiz form state
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    passing_score: 70,
    course_id: 1
  });

  // Question form state
  const [questionForm, setQuestionForm] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
    explanation: ''
  });

  const [showQuizForm, setShowQuizForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (quizId) {
      fetchQuizDetails(quizId);
    }
  }, [quizId]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchQuizzes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/quizzes/admin/list`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      }
    } catch (err) {
      setError('Quizler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizDetails = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/quizzes/admin/${id}`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedQuiz(data);
        setQuizForm({
          title: data.title,
          description: data.description || '',
          passing_score: data.passing_score,
          course_id: data.course_id
        });
      }
    } catch (err) {
      setError('Quiz detayları yüklenemedi');
    }
  };

  const createQuiz = async () => {
    setSaving(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/quizzes/admin/create`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(quizForm)
      });
      if (response.ok) {
        const data = await response.json();
        setSuccess('Quiz oluşturuldu!');
        setShowQuizForm(false);
        fetchQuizzes();
        navigate(`/admin/quizzes/${data.id}`);
      } else {
        const err = await response.json();
        setError(err.detail || 'Quiz oluşturulamadı');
      }
    } catch (err) {
      setError('Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const updateQuiz = async () => {
    if (!selectedQuiz) return;
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/quizzes/admin/${selectedQuiz.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(quizForm)
      });
      if (response.ok) {
        setSuccess('Quiz güncellendi!');
        fetchQuizDetails(selectedQuiz.id);
        fetchQuizzes();
      }
    } catch (err) {
      setError('Güncelleme başarısız');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async () => {
    if (!selectedQuiz) return;
    try {
      const response = await fetch(`${API_URL}/api/quizzes/admin/${selectedQuiz.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_published: !selectedQuiz.is_published })
      });
      if (response.ok) {
        setSuccess(selectedQuiz.is_published ? 'Quiz yayından kaldırıldı' : 'Quiz yayınlandı!');
        fetchQuizDetails(selectedQuiz.id);
        fetchQuizzes();
      }
    } catch (err) {
      setError('İşlem başarısız');
    }
  };

  const deleteQuiz = async (id) => {
    if (!confirm('Bu quizi silmek istediğinize emin misiniz?')) return;
    try {
      const response = await fetch(`${API_URL}/api/quizzes/admin/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setSuccess('Quiz silindi');
        setSelectedQuiz(null);
        fetchQuizzes();
        navigate('/admin/quizzes');
      }
    } catch (err) {
      setError('Silme başarısız');
    }
  };

  const addQuestion = async () => {
    if (!selectedQuiz) return;
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/quizzes/admin/${selectedQuiz.id}/questions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(questionForm)
      });
      if (response.ok) {
        setSuccess('Soru eklendi!');
        setShowQuestionForm(false);
        setQuestionForm({
          question_text: '',
          option_a: '',
          option_b: '',
          option_c: '',
          option_d: '',
          correct_answer: 'A',
          explanation: ''
        });
        fetchQuizDetails(selectedQuiz.id);
      }
    } catch (err) {
      setError('Soru eklenemedi');
    } finally {
      setSaving(false);
    }
  };

  const updateQuestion = async () => {
    if (!editingQuestion) return;
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/quizzes/admin/questions/${editingQuestion.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(questionForm)
      });
      if (response.ok) {
        setSuccess('Soru güncellendi!');
        setEditingQuestion(null);
        setShowQuestionForm(false);
        fetchQuizDetails(selectedQuiz.id);
      }
    } catch (err) {
      setError('Güncelleme başarısız');
    } finally {
      setSaving(false);
    }
  };

  const deleteQuestion = async (questionId) => {
    if (!confirm('Bu soruyu silmek istediğinize emin misiniz?')) return;
    try {
      const response = await fetch(`${API_URL}/api/quizzes/admin/questions/${questionId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setSuccess('Soru silindi');
        fetchQuizDetails(selectedQuiz.id);
      }
    } catch (err) {
      setError('Silme başarısız');
    }
  };

  const startEditQuestion = (question) => {
    setEditingQuestion(question);
    setQuestionForm({
      question_text: question.question_text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_answer: question.correct_answer,
      explanation: question.explanation || ''
    });
    setShowQuestionForm(true);
  };

  if (loading) {
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
        <h1 style={styles.title}>Quiz Yönetimi</h1>
      </div>

      {/* Messages */}
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <div style={styles.content}>
        {/* Quiz List Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h2 style={styles.sidebarTitle}>Quizler</h2>
            <button
              onClick={() => {
                setShowQuizForm(true);
                setSelectedQuiz(null);
                setQuizForm({ title: '', description: '', passing_score: 70, course_id: 1 });
              }}
              style={styles.addButton}
            >
              <Plus size={16} /> Yeni Quiz
            </button>
          </div>

          <div style={styles.quizList}>
            {quizzes.map(quiz => (
              <div
                key={quiz.id}
                onClick={() => navigate(`/admin/quizzes/${quiz.id}`)}
                style={{
                  ...styles.quizItem,
                  ...(selectedQuiz?.id === quiz.id ? styles.quizItemActive : {})
                }}
              >
                <div style={styles.quizItemTitle}>{quiz.title}</div>
                <div style={styles.quizItemMeta}>
                  <span>{quiz.question_count} soru</span>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: quiz.is_published ? 'rgba(0, 255, 157, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    color: quiz.is_published ? '#00ff9d' : '#666'
                  }}>
                    {quiz.is_published ? 'Yayında' : 'Taslak'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.main}>
          {/* New Quiz Form */}
          {showQuizForm && !selectedQuiz && (
            <div style={styles.formCard}>
              <h3 style={styles.formTitle}>Yeni Quiz Oluştur</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Quiz Başlığı</label>
                <input
                  type="text"
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  style={styles.input}
                  placeholder="Örn: Modül 1 - Temel Kavramlar"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Açıklama</label>
                <textarea
                  value={quizForm.description}
                  onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                  style={styles.textarea}
                  placeholder="Quiz hakkında kısa açıklama..."
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Geçme Notu (%)</label>
                <input
                  type="number"
                  value={quizForm.passing_score}
                  onChange={(e) => setQuizForm({ ...quizForm, passing_score: parseInt(e.target.value) })}
                  style={styles.input}
                  min="0"
                  max="100"
                />
              </div>
              <div style={styles.formActions}>
                <button onClick={() => setShowQuizForm(false)} style={styles.cancelButton}>
                  İptal
                </button>
                <button onClick={createQuiz} disabled={saving} style={styles.saveButton}>
                  <Save size={16} /> {saving ? 'Kaydediliyor...' : 'Oluştur'}
                </button>
              </div>
            </div>
          )}

          {/* Selected Quiz Details */}
          {selectedQuiz && (
            <>
              {/* Quiz Info */}
              <div style={styles.formCard}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.formTitle}>{selectedQuiz.title}</h3>
                  <div style={styles.cardActions}>
                    <button
                      onClick={togglePublish}
                      style={{
                        ...styles.publishButton,
                        backgroundColor: selectedQuiz.is_published ? 'rgba(255, 77, 87, 0.2)' : 'rgba(0, 255, 157, 0.2)',
                        color: selectedQuiz.is_published ? '#ff4d57' : '#00ff9d'
                      }}
                    >
                      {selectedQuiz.is_published ? 'Yayından Kaldır' : 'Yayınla'}
                    </button>
                    <button onClick={() => deleteQuiz(selectedQuiz.id)} style={styles.deleteButton}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Quiz Başlığı</label>
                  <input
                    type="text"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Açıklama</label>
                  <textarea
                    value={quizForm.description}
                    onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                    style={styles.textarea}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Geçme Notu (%)</label>
                  <input
                    type="number"
                    value={quizForm.passing_score}
                    onChange={(e) => setQuizForm({ ...quizForm, passing_score: parseInt(e.target.value) })}
                    style={styles.input}
                    min="0"
                    max="100"
                  />
                </div>
                <button onClick={updateQuiz} disabled={saving} style={styles.saveButton}>
                  <Save size={16} /> {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
              </div>

              {/* Questions */}
              <div style={styles.questionsSection}>
                <div style={styles.sectionHeader}>
                  <h3 style={styles.sectionTitle}>Sorular ({selectedQuiz.questions?.length || 0})</h3>
                  <button
                    onClick={() => {
                      setShowQuestionForm(true);
                      setEditingQuestion(null);
                      setQuestionForm({
                        question_text: '',
                        option_a: '',
                        option_b: '',
                        option_c: '',
                        option_d: '',
                        correct_answer: 'A',
                        explanation: ''
                      });
                    }}
                    style={styles.addButton}
                  >
                    <Plus size={16} /> Soru Ekle
                  </button>
                </div>

                {/* Question Form */}
                {showQuestionForm && (
                  <div style={styles.questionForm}>
                    <h4 style={styles.questionFormTitle}>
                      {editingQuestion ? 'Soruyu Düzenle' : 'Yeni Soru Ekle'}
                    </h4>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Soru Metni</label>
                      <textarea
                        value={questionForm.question_text}
                        onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                        style={styles.textarea}
                        placeholder="Soruyu yazın..."
                      />
                    </div>

                    <div style={styles.optionsGrid}>
                      {['A', 'B', 'C', 'D'].map(letter => (
                        <div key={letter} style={styles.optionGroup}>
                          <label style={styles.label}>
                            <input
                              type="radio"
                              name="correct_answer"
                              checked={questionForm.correct_answer === letter}
                              onChange={() => setQuestionForm({ ...questionForm, correct_answer: letter })}
                              style={styles.radio}
                            />
                            Seçenek {letter} {questionForm.correct_answer === letter && '(Doğru)'}
                          </label>
                          <input
                            type="text"
                            value={questionForm[`option_${letter.toLowerCase()}`]}
                            onChange={(e) => setQuestionForm({
                              ...questionForm,
                              [`option_${letter.toLowerCase()}`]: e.target.value
                            })}
                            style={{
                              ...styles.input,
                              borderColor: questionForm.correct_answer === letter ? '#00ff9d' : 'rgba(255, 255, 255, 0.1)'
                            }}
                            placeholder={`Seçenek ${letter}`}
                          />
                        </div>
                      ))}
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Açıklama (Opsiyonel)</label>
                      <textarea
                        value={questionForm.explanation}
                        onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                        style={styles.textarea}
                        placeholder="Doğru cevabın açıklaması..."
                      />
                    </div>

                    <div style={styles.formActions}>
                      <button
                        onClick={() => {
                          setShowQuestionForm(false);
                          setEditingQuestion(null);
                        }}
                        style={styles.cancelButton}
                      >
                        İptal
                      </button>
                      <button
                        onClick={editingQuestion ? updateQuestion : addQuestion}
                        disabled={saving}
                        style={styles.saveButton}
                      >
                        <Save size={16} /> {saving ? 'Kaydediliyor...' : (editingQuestion ? 'Güncelle' : 'Ekle')}
                      </button>
                    </div>
                  </div>
                )}

                {/* Questions List */}
                <div style={styles.questionsList}>
                  {selectedQuiz.questions?.map((question, index) => (
                    <div key={question.id} style={styles.questionCard}>
                      <div style={styles.questionHeader}>
                        <span style={styles.questionNumber}>{index + 1}</span>
                        <span style={styles.questionText}>{question.question_text}</span>
                        <div style={styles.questionActions}>
                          <button
                            onClick={() => startEditQuestion(question)}
                            style={styles.iconButton}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteQuestion(question.id)}
                            style={{ ...styles.iconButton, color: '#ff4d57' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div style={styles.optionsList}>
                        {['A', 'B', 'C', 'D'].map(letter => (
                          <div
                            key={letter}
                            style={{
                              ...styles.optionItem,
                              ...(question.correct_answer === letter ? styles.correctOption : {})
                            }}
                          >
                            <span style={styles.optionLetter}>{letter}</span>
                            <span>{question[`option_${letter.toLowerCase()}`]}</span>
                            {question.correct_answer === letter && (
                              <Check size={16} style={{ color: '#00ff9d', marginLeft: 'auto' }} />
                            )}
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <div style={styles.explanation}>
                          <strong>Açıklama:</strong> {question.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Empty State */}
          {!selectedQuiz && !showQuizForm && (
            <div style={styles.emptyState}>
              <p>Bir quiz seçin veya yeni quiz oluşturun</p>
            </div>
          )}
        </div>
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
    background: 'linear-gradient(135deg, #00d9ff 0%, #00ff9d 100%)',
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
  content: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '2rem',
  },
  sidebar: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
    height: 'fit-content',
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  sidebarTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    margin: 0,
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    backgroundColor: 'rgba(0, 255, 157, 0.2)',
    color: '#00ff9d',
    border: '1px solid rgba(0, 255, 157, 0.3)',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  quizList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  quizItem: {
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid transparent',
  },
  quizItemActive: {
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    borderColor: 'rgba(0, 217, 255, 0.3)',
  },
  quizItemTitle: {
    fontWeight: '500',
    marginBottom: '0.25rem',
  },
  quizItemMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: '#666',
  },
  badge: {
    padding: '0.2rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.7rem',
    fontWeight: '500',
  },
  main: {
    flex: 1,
  },
  formCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  cardActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  formTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: 0,
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
    minHeight: '80px',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '1.5rem',
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
  cancelButton: {
    backgroundColor: 'transparent',
    color: '#a0a0a0',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  publishButton: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.85rem',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 77, 87, 0.2)',
    color: '#ff4d57',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionsSection: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: 0,
  },
  questionForm: {
    backgroundColor: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  questionFormTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#00d9ff',
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem',
  },
  optionGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  radio: {
    marginRight: '0.5rem',
  },
  questionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    padding: '1rem',
  },
  questionHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '1rem',
  },
  questionNumber: {
    backgroundColor: 'rgba(0, 217, 255, 0.2)',
    color: '#00d9ff',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.25rem',
    fontWeight: '600',
    fontSize: '0.85rem',
  },
  questionText: {
    flex: 1,
    fontSize: '1rem',
    lineHeight: '1.5',
  },
  questionActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  iconButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s',
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  optionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '0.5rem',
    fontSize: '0.9rem',
  },
  correctOption: {
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    border: '1px solid rgba(0, 255, 157, 0.3)',
  },
  optionLetter: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontWeight: '600',
    fontSize: '0.8rem',
  },
  explanation: {
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(112, 0, 255, 0.1)',
    borderRadius: '0.5rem',
    fontSize: '0.85rem',
    color: '#a0a0a0',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem',
    color: '#666',
  },
};

export default AdminQuizBuilder;
