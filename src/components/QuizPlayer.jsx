import React, { useState, useEffect } from 'react';
import { Check, X, Trophy, RefreshCw, ChevronRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://videomaster-backend-production.up.railway.app';

export function QuizPlayer({ quizId, onComplete }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`${API_URL}/api/quizzes/${quizId}`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setQuiz(data);
      } else {
        setError('Quiz yüklenemedi');
      }
    } catch (err) {
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionId, answer) => {
    if (submitted) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ answers })
      });
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setSubmitted(true);
        if (onComplete) {
          onComplete(data);
        }
      } else {
        setError('Quiz gönderilemedi');
      }
    } catch (err) {
      setError('Bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    setResults(null);
    setCurrentQuestion(0);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Quiz yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  if (!quiz) return null;

  // Results Screen
  if (submitted && results) {
    return (
      <div style={styles.container}>
        <div style={styles.resultsCard}>
          <div style={{
            ...styles.resultIcon,
            backgroundColor: results.passed ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 77, 87, 0.1)',
            color: results.passed ? '#00ff9d' : '#ff4d57'
          }}>
            {results.passed ? <Trophy size={48} /> : <X size={48} />}
          </div>

          <h2 style={styles.resultTitle}>
            {results.passed ? 'Tebrikler!' : 'Tekrar Dene'}
          </h2>

          <div style={styles.scoreCircle}>
            <span style={{
              ...styles.scoreNumber,
              color: results.passed ? '#00ff9d' : '#ff4d57'
            }}>
              {results.score}%
            </span>
            <span style={styles.scoreLabel}>Puan</span>
          </div>

          <div style={styles.resultStats}>
            <div style={styles.statItem}>
              <span style={styles.statValue}>{results.correct_count}</span>
              <span style={styles.statLabel}>Doğru</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={styles.statValue}>{results.total_questions - results.correct_count}</span>
              <span style={styles.statLabel}>Yanlış</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={styles.statValue}>{results.passing_score}%</span>
              <span style={styles.statLabel}>Geçme Notu</span>
            </div>
          </div>

          {/* Detailed Results */}
          <div style={styles.detailedResults}>
            <h3 style={styles.detailedTitle}>Sonuçlar</h3>
            {results.results.map((result, index) => (
              <div key={index} style={{
                ...styles.resultItem,
                borderColor: result.is_correct ? 'rgba(0, 255, 157, 0.3)' : 'rgba(255, 77, 87, 0.3)'
              }}>
                <div style={styles.resultItemHeader}>
                  <span style={styles.resultNumber}>{index + 1}</span>
                  {result.is_correct ? (
                    <Check size={20} style={{ color: '#00ff9d' }} />
                  ) : (
                    <X size={20} style={{ color: '#ff4d57' }} />
                  )}
                </div>
                <p style={styles.resultQuestion}>{result.question_text}</p>
                <div style={styles.resultAnswers}>
                  <div style={{
                    ...styles.answerTag,
                    backgroundColor: result.is_correct ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 77, 87, 0.1)',
                    color: result.is_correct ? '#00ff9d' : '#ff4d57'
                  }}>
                    Senin cevabın: {result.user_answer || '-'}
                  </div>
                  {!result.is_correct && (
                    <div style={{
                      ...styles.answerTag,
                      backgroundColor: 'rgba(0, 255, 157, 0.1)',
                      color: '#00ff9d'
                    }}>
                      Doğru cevap: {result.correct_answer}
                    </div>
                  )}
                </div>
                {result.explanation && (
                  <p style={styles.explanation}>{result.explanation}</p>
                )}
              </div>
            ))}
          </div>

          <button onClick={resetQuiz} style={styles.retryButton}>
            <RefreshCw size={18} /> Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  // Quiz Screen
  const question = quiz.questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === quiz.questions.length;

  return (
    <div style={styles.container}>
      <div style={styles.quizCard}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>{quiz.title}</h2>
          <div style={styles.progress}>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${(answeredCount / quiz.questions.length) * 100}%`
                }}
              />
            </div>
            <span style={styles.progressText}>
              {answeredCount} / {quiz.questions.length}
            </span>
          </div>
        </div>

        {/* Question Navigation */}
        <div style={styles.questionNav}>
          {quiz.questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(index)}
              style={{
                ...styles.navButton,
                backgroundColor: currentQuestion === index
                  ? 'rgba(0, 217, 255, 0.3)'
                  : answers[q.id]
                    ? 'rgba(0, 255, 157, 0.2)'
                    : 'rgba(255, 255, 255, 0.1)',
                borderColor: currentQuestion === index
                  ? '#00d9ff'
                  : answers[q.id]
                    ? '#00ff9d'
                    : 'transparent'
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Question */}
        <div style={styles.questionSection}>
          <div style={styles.questionNumber}>Soru {currentQuestion + 1}</div>
          <p style={styles.questionText}>{question.question_text}</p>

          <div style={styles.options}>
            {['A', 'B', 'C', 'D'].map(letter => (
              <button
                key={letter}
                onClick={() => selectAnswer(question.id.toString(), letter)}
                style={{
                  ...styles.optionButton,
                  backgroundColor: answers[question.id.toString()] === letter
                    ? 'rgba(0, 217, 255, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)',
                  borderColor: answers[question.id.toString()] === letter
                    ? '#00d9ff'
                    : 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <span style={styles.optionLetter}>{letter}</span>
                <span style={styles.optionText}>{question[`option_${letter.toLowerCase()}`]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={styles.navigation}>
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            style={{
              ...styles.navArrowButton,
              opacity: currentQuestion === 0 ? 0.3 : 1
            }}
          >
            Önceki
          </button>

          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              style={styles.navArrowButton}
            >
              Sonraki <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={submitQuiz}
              disabled={!allAnswered || submitting}
              style={{
                ...styles.submitButton,
                opacity: allAnswered ? 1 : 0.5
              }}
            >
              {submitting ? 'Gönderiliyor...' : 'Bitir'}
            </button>
          )}
        </div>

        {!allAnswered && (
          <p style={styles.warningText}>
            Tüm soruları cevaplamalısınız ({quiz.questions.length - answeredCount} soru kaldı)
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '1rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666',
  },
  error: {
    backgroundColor: 'rgba(255, 77, 87, 0.1)',
    border: '1px solid #ff4d57',
    color: '#ff4d57',
    padding: '1rem',
    borderRadius: '0.5rem',
    textAlign: 'center',
  },
  quizCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '2rem',
  },
  header: {
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#fff',
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  progressBar: {
    flex: 1,
    height: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff9d',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressText: {
    color: '#a0a0a0',
    fontSize: '0.9rem',
    minWidth: '60px',
    textAlign: 'right',
  },
  questionNav: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  navButton: {
    width: '36px',
    height: '36px',
    borderRadius: '0.5rem',
    border: '1px solid transparent',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  questionSection: {
    marginBottom: '2rem',
  },
  questionNumber: {
    color: '#00d9ff',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
  },
  questionText: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#fff',
    marginBottom: '1.5rem',
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  optionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
    width: '100%',
  },
  optionLetter: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
    color: '#fff',
    minWidth: '40px',
    textAlign: 'center',
  },
  optionText: {
    color: '#fff',
    flex: 1,
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  navArrowButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.5rem',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 2rem',
    backgroundColor: '#00ff9d',
    border: 'none',
    borderRadius: '0.5rem',
    color: '#000',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  warningText: {
    textAlign: 'center',
    color: '#ff9d00',
    fontSize: '0.85rem',
    marginTop: '1rem',
  },
  // Results Styles
  resultsCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '2rem',
    textAlign: 'center',
  },
  resultIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
  },
  resultTitle: {
    fontSize: '1.75rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    color: '#fff',
  },
  scoreCircle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  scoreNumber: {
    fontSize: '3rem',
    fontWeight: '700',
  },
  scoreLabel: {
    color: '#666',
    fontSize: '0.9rem',
  },
  resultStats: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2rem',
    marginBottom: '2rem',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#fff',
  },
  statLabel: {
    color: '#666',
    fontSize: '0.8rem',
  },
  statDivider: {
    width: '1px',
    height: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailedResults: {
    textAlign: 'left',
    marginBottom: '2rem',
  },
  detailedTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#fff',
  },
  resultItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid',
    borderRadius: '0.75rem',
    padding: '1rem',
    marginBottom: '0.75rem',
  },
  resultItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  resultNumber: {
    backgroundColor: 'rgba(0, 217, 255, 0.2)',
    color: '#00d9ff',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.25rem',
    fontWeight: '600',
    fontSize: '0.8rem',
  },
  resultQuestion: {
    color: '#fff',
    marginBottom: '0.75rem',
    fontSize: '0.95rem',
  },
  resultAnswers: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  answerTag: {
    padding: '0.25rem 0.75rem',
    borderRadius: '0.25rem',
    fontSize: '0.85rem',
  },
  explanation: {
    marginTop: '0.75rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(112, 0, 255, 0.1)',
    borderRadius: '0.5rem',
    fontSize: '0.85rem',
    color: '#a0a0a0',
  },
  retryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 2rem',
    backgroundColor: 'rgba(0, 217, 255, 0.2)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    borderRadius: '0.5rem',
    color: '#00d9ff',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
};

export default QuizPlayer;
