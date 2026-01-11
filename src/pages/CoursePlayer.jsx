import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getCourse, getLessonVideo, updateProgress, getMyProgress } from '../api/courseApi';
import { trackVideoStart, trackVideoComplete, setTag } from '../utils/clarity';
import { QuizPlayer } from '../components/QuizPlayer';
import { Reviews } from '../components/Reviews';

const API_URL = import.meta.env.VITE_API_URL || 'https://videomaster-backend-production.up.railway.app';

export function CoursePlayer() {
  const { courseId, lessonId, quizId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]); // Unified content list (lessons + quizzes)
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [progress, setProgress] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('content'); // content, reviews

  const progressIntervalRef = useRef(null);
  const watchedSecondsRef = useRef(0);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/giris');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && courseId) {
      loadCourseData();
    }
  }, [isAuthenticated, courseId]);

  useEffect(() => {
    if (lessonId && course) {
      setCurrentQuiz(null);
      loadLessonVideo(parseInt(lessonId));
    }
  }, [lessonId, course]);

  useEffect(() => {
    if (quizId && contents.length > 0) {
      setCurrentLesson(null);
      setVideoData(null);
      loadQuiz(parseInt(quizId));
    }
  }, [quizId, contents]);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const [courseData, progressData, attemptsData, contentsData] = await Promise.all([
        getCourse(courseId),
        getMyProgress(),
        fetchQuizAttempts(),
        fetchCourseContents()
      ]);
      setCourse(courseData);
      setProgress(progressData);
      setQuizAttempts(attemptsData || []);
      setContents(contentsData || []);

      // Navigate to first content if no lesson or quiz selected
      if (!lessonId && !quizId && contentsData?.length > 0) {
        const firstContent = contentsData[0];
        if (firstContent.content_type === 'lesson') {
          navigate(`/kurs/${courseId}/ders/${firstContent.content_id}`, { replace: true });
        } else {
          navigate(`/kurs/${courseId}/quiz/${firstContent.content_id}`, { replace: true });
        }
      } else if (!lessonId && !quizId && courseData.lessons?.length > 0) {
        navigate(`/kurs/${courseId}/ders/${courseData.lessons[0].id}`, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseContents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/quizzes/course/${courseId}/contents`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch {
      return [];
    }
  };

  const fetchQuizAttempts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/quizzes/my-attempts`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch {
      return [];
    }
  };

  const loadLessonVideo = async (lId) => {
    const lesson = course?.lessons?.find((l) => l.id === lId);
    setCurrentLesson(lesson);
    setVideoData(null);
    setError('');

    try {
      const video = await getLessonVideo(courseId, lId);
      setVideoData(video);
      watchedSecondsRef.current = 0;
      // Clarity: Video started
      if (lesson) {
        trackVideoStart(lId, lesson.title);
        setTag('current_course', course?.title || courseId);
      }

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      progressIntervalRef.current = setInterval(() => {
        watchedSecondsRef.current += 10;
        updateProgress(lId, watchedSecondsRef.current, false).catch(() => {});
      }, 10000);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadQuiz = async (qId) => {
    try {
      const response = await fetch(`${API_URL}/api/quizzes/${qId}`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const quizData = await response.json();
        setCurrentQuiz(quizData);
      } else {
        setError('Quiz yuklenemedi');
      }
    } catch (err) {
      setError('Quiz yuklenemedi');
    }
  };

  const handleContentClick = (content) => {
    if (content.content_type === 'lesson') {
      navigate(`/kurs/${courseId}/ders/${content.content_id}`);
    } else {
      navigate(`/kurs/${courseId}/quiz/${content.content_id}`);
    }
  };

  const handleLessonClick = (lesson) => {
    navigate(`/kurs/${courseId}/ders/${lesson.id}`);
  };

  const handleComplete = async () => {
    if (currentLesson) {
      await updateProgress(currentLesson.id, watchedSecondsRef.current, true);
      const updatedProgress = await getMyProgress();
      setProgress(updatedProgress);
      // Clarity: Video completed
      trackVideoComplete(currentLesson.id);
    }
  };

  const handleQuizComplete = async () => {
    const attempts = await fetchQuizAttempts();
    setQuizAttempts(attempts || []);
  };

  const isLessonCompleted = (lessonId) => {
    return progress.some((p) => p.lesson_id === lessonId && p.completed);
  };

  const isQuizCompleted = (quizId) => {
    return quizAttempts.some((a) => a.quiz_id === quizId && a.passed);
  };

  const getContentIcon = (contentType) => {
    return contentType === 'lesson' ? '▶' : '?';
  };

  if (authLoading || loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Yukleniyor...</div>
      </div>
    );
  }

  if (error && !videoData && !currentQuiz) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2 style={styles.errorTitle}>{error}</h2>
          {error.includes('satin') && (
            <Link to="/#products" style={styles.buyBtn}>
              Kursu Satin Al
            </Link>
          )}
          <Link to="/dashboard" style={styles.backLink}>
            Dashboard'a Don
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <Link to="/dashboard" style={styles.logo}>
          VideoMaster
        </Link>
        <h1 style={styles.courseTitle}>{course?.title}</h1>
        <button
          style={styles.menuBtn}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
      </header>

      <div style={styles.main}>
        {/* Content Area */}
        <div style={styles.contentArea}>
          {/* Tabs */}
          <div style={styles.tabs}>
            <button
              onClick={() => setActiveTab('content')}
              style={{
                ...styles.tab,
                ...(activeTab === 'content' ? styles.tabActive : {})
              }}
            >
              Icerik
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                ...styles.tab,
                ...(activeTab === 'reviews' ? styles.tabActive : {})
              }}
            >
              Yorumlar
            </button>
          </div>

          {activeTab === 'content' && (
            <>
              {/* Quiz Player */}
              {currentQuiz && (
                <div style={styles.quizContainer}>
                  <QuizPlayer
                    quiz={currentQuiz}
                    onComplete={handleQuizComplete}
                  />
                </div>
              )}

              {/* Video Player */}
              {videoData && !currentQuiz && (
                <>
                  <div style={styles.videoWrapper}>
                    <iframe
                      src={videoData.embed_url}
                      style={styles.videoIframe}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={videoData.title}
                    />
                  </div>
                  <div style={styles.videoInfo}>
                    <h2 style={styles.lessonTitle}>{currentLesson?.title}</h2>
                    <p style={styles.lessonDesc}>{currentLesson?.description}</p>
                    <button onClick={handleComplete} style={styles.completeBtn}>
                      Dersi Tamamla
                    </button>
                  </div>
                </>
              )}

              {/* Empty State */}
              {!videoData && !currentQuiz && (
                <div style={styles.noContent}>
                  <p>Bir ders veya quiz secin</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'reviews' && (
            <div style={styles.reviewsContainer}>
              <Reviews courseId={parseInt(courseId)} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside style={{ ...styles.sidebar, ...(sidebarOpen ? {} : styles.sidebarClosed) }}>
          <h3 style={styles.sidebarTitle}>Icerikler</h3>
          <div style={styles.contentList}>
            {/* Use unified contents if available, otherwise fall back to lessons */}
            {contents.length > 0 ? (
              contents.map((content, index) => (
                <button
                  key={`${content.content_type}-${content.content_id}`}
                  onClick={() => handleContentClick(content)}
                  style={{
                    ...styles.contentItem,
                    ...((content.content_type === 'lesson' && currentLesson?.id === content.content_id) ||
                      (content.content_type === 'quiz' && currentQuiz?.id === content.content_id)
                      ? styles.contentItemActive : {}),
                  }}
                >
                  <span style={{
                    ...styles.contentNumber,
                    backgroundColor: content.content_type === 'quiz'
                      ? 'rgba(112, 0, 255, 0.2)'
                      : 'rgba(255,255,255,0.1)',
                    color: content.content_type === 'quiz' ? '#a78bfa' : '#fff'
                  }}>
                    {content.content_type === 'lesson' ? index + 1 : '?'}
                  </span>
                  <div style={styles.contentInfo}>
                    <span style={styles.contentName}>{content.title}</span>
                    <span style={styles.contentMeta}>
                      {content.content_type === 'lesson' ? (
                        `${Math.floor((content.duration_seconds || 0) / 60)} dk`
                      ) : (
                        `${content.question_count || 0} soru`
                      )}
                    </span>
                  </div>
                  {content.content_type === 'lesson' && isLessonCompleted(content.content_id) && (
                    <span style={styles.checkMark}>✓</span>
                  )}
                  {content.content_type === 'quiz' && isQuizCompleted(content.content_id) && (
                    <span style={styles.checkMark}>✓</span>
                  )}
                  {content.content_type === 'quiz' && (
                    <span style={styles.quizBadge}>Quiz</span>
                  )}
                  {content.is_free && <span style={styles.freeBadge}>Ucretsiz</span>}
                </button>
              ))
            ) : (
              course?.lessons?.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  style={{
                    ...styles.contentItem,
                    ...(currentLesson?.id === lesson.id ? styles.contentItemActive : {}),
                  }}
                >
                  <span style={styles.contentNumber}>{index + 1}</span>
                  <div style={styles.contentInfo}>
                    <span style={styles.contentName}>{lesson.title}</span>
                    <span style={styles.contentMeta}>
                      {Math.floor(lesson.duration_seconds / 60)} dk
                    </span>
                  </div>
                  {isLessonCompleted(lesson.id) && (
                    <span style={styles.checkMark}>✓</span>
                  )}
                  {lesson.is_free && <span style={styles.freeBadge}>Ucretsiz</span>}
                </button>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#fff',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    color: '#a0a0a0',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '1rem',
  },
  errorTitle: {
    fontSize: '1.5rem',
    color: '#ff4757',
  },
  buyBtn: {
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    color: '#000',
    borderRadius: '2rem',
    textDecoration: 'none',
    fontWeight: '600',
  },
  backLink: {
    color: '#a0a0a0',
    textDecoration: 'none',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    position: 'sticky',
    top: 0,
    backgroundColor: '#0a0a0a',
    zIndex: 100,
  },
  logo: {
    fontSize: '1.25rem',
    fontWeight: '700',
    background: 'linear-gradient(to right, #00ff9d, #7000ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textDecoration: 'none',
  },
  courseTitle: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#a0a0a0',
    margin: 0,
  },
  menuBtn: {
    padding: '0.5rem',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '0.5rem',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1.25rem',
  },
  main: {
    display: 'flex',
    height: 'calc(100vh - 60px)',
  },
  contentArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    padding: '0 1rem',
  },
  tab: {
    padding: '1rem 1.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    borderBottom: '2px solid transparent',
    marginBottom: '-1px',
  },
  tabActive: {
    color: '#00ff9d',
    borderBottomColor: '#00ff9d',
  },
  quizContainer: {
    flex: 1,
    padding: '1.5rem',
    overflow: 'auto',
  },
  videoWrapper: {
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%',
    backgroundColor: '#000',
  },
  videoIframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },
  videoInfo: {
    padding: '1.5rem',
  },
  lessonTitle: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
  },
  lessonDesc: {
    color: '#a0a0a0',
    marginBottom: '1rem',
  },
  completeBtn: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    color: '#000',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
  },
  noContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#a0a0a0',
  },
  reviewsContainer: {
    flex: 1,
    padding: '1.5rem',
    overflow: 'auto',
  },
  sidebar: {
    width: '320px',
    borderLeft: '1px solid rgba(255,255,255,0.1)',
    overflow: 'auto',
    transition: 'width 0.3s, opacity 0.3s',
  },
  sidebarClosed: {
    width: '0',
    opacity: '0',
    overflow: 'hidden',
  },
  sidebarTitle: {
    padding: '1rem 1.5rem',
    margin: 0,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  contentList: {
    display: 'flex',
    flexDirection: 'column',
  },
  contentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    color: '#fff',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.2s',
  },
  contentItemActive: {
    backgroundColor: 'rgba(0,255,157,0.1)',
    borderLeft: '3px solid #00ff9d',
  },
  contentNumber: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    flexShrink: 0,
  },
  contentInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  contentName: {
    fontSize: '0.9rem',
  },
  contentMeta: {
    fontSize: '0.75rem',
    color: '#a0a0a0',
  },
  checkMark: {
    color: '#00ff9d',
    fontWeight: 'bold',
  },
  quizBadge: {
    fontSize: '0.65rem',
    padding: '0.15rem 0.4rem',
    backgroundColor: 'rgba(112, 0, 255, 0.2)',
    color: '#a78bfa',
    borderRadius: '0.25rem',
    fontWeight: '500',
  },
  freeBadge: {
    fontSize: '0.7rem',
    padding: '0.2rem 0.5rem',
    backgroundColor: 'rgba(0,255,157,0.2)',
    color: '#00ff9d',
    borderRadius: '1rem',
  },
};
