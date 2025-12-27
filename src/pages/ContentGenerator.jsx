import { useState } from 'react';
import { useContentGenerator } from '../hooks/useContentGenerator';

const STEP_NAMES = [
  '',
  'Konu Doğrulama',
  'Araştırma Yapılıyor',
  'Hikayeleştirme',
  'Optimizasyon',
  'Final Derleme',
];

export function ContentGenerator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [topic, setTopic] = useState('');

  const {
    generate,
    isLoading,
    currentStep,
    result,
    error,
    reset,
  } = useContentGenerator();

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === '9999') {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Yanlış parola!');
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    await generate(topic);
  };

  // Parola ekranı
  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>İçerik Üretimi</h1>
          <p style={styles.subtitle}>Bu alana erişmek için parola gerekli</p>

          <form onSubmit={handlePasswordSubmit} style={styles.form}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parola girin..."
              style={styles.input}
            />
            {passwordError && <p style={styles.error}>{passwordError}</p>}
            <button type="submit" style={styles.button}>
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  // İçerik üretim ekranı
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>İçerik Üretimi</h1>
        <p style={styles.subtitle}>Instagram için viral içerik oluştur</p>

        <form onSubmit={handleGenerate} style={styles.form}>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Konu girin (örn: Yapay Zeka, Uzay, Psikoloji)"
            style={styles.input}
            disabled={isLoading}
          />
          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Oluşturuluyor...' : 'İçerik Oluştur'}
          </button>
        </form>

        {/* Loading durumu */}
        {isLoading && (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p style={styles.stepText}>
              Adım {currentStep}/5: {STEP_NAMES[currentStep] || 'Başlatılıyor...'}
            </p>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${(currentStep / 5) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Hata */}
        {error && (
          <div style={styles.errorBox}>
            <p>Hata: {error}</p>
            <button onClick={reset} style={styles.resetButton}>
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Sonuç */}
        {result && (
          <div style={styles.result}>
            <div style={styles.resultHeader}>
              <h2 style={styles.resultTitle}>{result.video_title}</h2>
              <button onClick={reset} style={styles.resetButton}>
                Yeni İçerik
              </button>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>📋 Viral Bilgiler</h3>
              <ul style={styles.list}>
                {result.interesting_facts?.map((fact, i) => (
                  <li key={i} style={styles.listItem}>{fact}</li>
                ))}
              </ul>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>🎬 Script</h3>
              <pre style={styles.script}>{result.optimized_script || result.original_script}</pre>
            </div>

            {result.keywords?.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>🏷️ Anahtar Kelimeler</h3>
                <div style={styles.keywords}>
                  {result.keywords.map((kw, i) => (
                    <span key={i} style={styles.keyword}>{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {result.hashtags && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}># Hashtagler</h3>
                <p style={styles.hashtags}>{result.hashtags}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1.5rem',
    padding: '3rem',
    maxWidth: '800px',
    width: '100%',
    backdropFilter: 'blur(10px)',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    background: 'linear-gradient(to right, #00ff9d, #7000ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
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
    padding: '1rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    color: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    color: '#000',
    border: 'none',
    borderRadius: '9999px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  error: {
    color: '#ff4757',
    fontSize: '0.9rem',
  },
  loading: {
    marginTop: '2rem',
    textAlign: 'center',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(0, 255, 157, 0.2)',
    borderTop: '3px solid #00ff9d',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem',
  },
  stepText: {
    color: '#a0a0a0',
    marginBottom: '1rem',
  },
  progressBar: {
    height: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(to right, #00ff9d, #7000ff)',
    transition: 'width 0.5s ease',
  },
  errorBox: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    border: '1px solid rgba(255, 71, 87, 0.3)',
    borderRadius: '0.75rem',
    color: '#ff4757',
  },
  resetButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  result: {
    marginTop: '2rem',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  resultTitle: {
    fontSize: '1.5rem',
    color: '#00ff9d',
  },
  section: {
    marginBottom: '1.5rem',
    padding: '1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '0.75rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    color: '#fff',
    marginBottom: '1rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    padding: '0.75rem 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    color: '#a0a0a0',
    fontSize: '0.95rem',
  },
  script: {
    whiteSpace: 'pre-wrap',
    fontFamily: 'inherit',
    color: '#a0a0a0',
    lineHeight: '1.8',
    fontSize: '0.95rem',
  },
  keywords: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  keyword: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(112, 0, 255, 0.2)',
    border: '1px solid rgba(112, 0, 255, 0.3)',
    borderRadius: '9999px',
    color: '#a0a0a0',
    fontSize: '0.85rem',
  },
  hashtags: {
    color: '#00ff9d',
    wordBreak: 'break-all',
  },
};
