import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getCourse, getLessonVideo, updateProgress, getMyProgress } from '../api/courseApi';
import { trackVideoStart, trackVideoComplete, setTag } from '../utils/clarity';

export function CoursePlayer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      loadLessonVideo(parseInt(lessonId));
    }
  }, [lessonId, course]);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const [courseData, progressData] = await Promise.all([
        getCourse(courseId),
        getMyProgress(),
      ]);
      setCourse(courseData);
      setProgress(progressData);

      if (!lessonId && courseData.lessons?.length > 0) {
        navigate(`/kurs/${courseId}/ders/${courseData.lessons[0].id}`, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLessonVideo = async (lId) => {
    const lesson = course?.lessons?.find((l) => l.id === lId);
    setCurrentLesson(lesson);
    setVideoData(null);
    setError('');

    try {
      const video = await getLessonVideo(lId);
      setVideoData(video);
      watchedSecondsRef.current = 0;
      // Clarity: Video başladı
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

  const handleLessonClick = (lesson) => {
    navigate(`/kurs/${courseId}/ders/${lesson.id}`);
  };

  const handleComplete = async () => {
    if (currentLesson) {
      await updateProgress(currentLesson.id, watchedSecondsRef.current, true);
      const updatedProgress = await getMyProgress();
      setProgress(updatedProgress);
      // Clarity: Video tamamlandı
      trackVideoComplete(currentLesson.id);
    }
  };

  const isLessonCompleted = (lessonId) => {
    return progress.some((p) => p.lesson_id === lessonId && p.completed);
  };

  if (authLoading || loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Yükleniyor...</div>
      </div>
    );
  }

  if (error && !videoData) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2 style={styles.errorTitle}>{error}</h2>
          {error.includes('satın') && (
            <Link to="/#products" style={styles.buyBtn}>
              Kursu Satın Al
            </Link>
          )}
          <Link to="/dashboard" style={styles.backLink}>
            Dashboard'a Dön
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
        {/* Video Area */}
        <div style={styles.videoArea}>
          {videoData ? (
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
                  ✓ Dersi Tamamla
                </button>
              </div>
            </>
          ) : (
            <div style={styles.noVideo}>
              <p>Bir ders seçin</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside style={{ ...styles.sidebar, ...(sidebarOpen ? {} : styles.sidebarClosed) }}>
          <h3 style={styles.sidebarTitle}>Dersler</h3>
          <div style={styles.lessonList}>
            {course?.lessons?.map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => handleLessonClick(lesson)}
                style={{
                  ...styles.lessonItem,
                  ...(currentLesson?.id === lesson.id ? styles.lessonItemActive : {}),
                }}
              >
                <span style={styles.lessonNumber}>{index + 1}</span>
                <div style={styles.lessonInfo}>
                  <span style={styles.lessonName}>{lesson.title}</span>
                  <span style={styles.lessonDuration}>
                    {Math.floor(lesson.duration_seconds / 60)} dk
                  </span>
                </div>
                {isLessonCompleted(lesson.id) && (
                  <span style={styles.checkMark}>✓</span>
                )}
                {lesson.is_free && <span style={styles.freeBadge}>Ücretsiz</span>}
              </button>
            ))}
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
  videoArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
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
  noVideo: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#a0a0a0',
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
  lessonList: {
    display: 'flex',
    flexDirection: 'column',
  },
  lessonItem: {
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
  lessonItemActive: {
    backgroundColor: 'rgba(0,255,157,0.1)',
    borderLeft: '3px solid #00ff9d',
  },
  lessonNumber: {
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
  lessonInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  lessonName: {
    fontSize: '0.9rem',
  },
  lessonDuration: {
    fontSize: '0.75rem',
    color: '#a0a0a0',
  },
  checkMark: {
    color: '#00ff9d',
    fontWeight: 'bold',
  },
  freeBadge: {
    fontSize: '0.7rem',
    padding: '0.2rem 0.5rem',
    backgroundColor: 'rgba(0,255,157,0.2)',
    color: '#00ff9d',
    borderRadius: '1rem',
  },
};
