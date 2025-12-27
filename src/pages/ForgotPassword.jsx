import { useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'https://videomaster-backend-production.up.railway.app';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setSent(true);
      } else {
        setError(data.detail || 'Bir hata oluştu');
      }
    } catch (err) {
      setError('Sunucuya bağlanılamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Link to="/giris" style={styles.backLink}>← Giriş Sayfası</Link>

        <h1 style={styles.title}>Şifremi Unuttum</h1>
        <p style={styles.subtitle}>
          Email adresinizi girin, size şifre sıfırlama linki gönderelim.
        </p>

        {sent ? (
          <div style={styles.successBox}>
            <p style={styles.successText}>{message}</p>
            <p style={styles.infoText}>
              Email'inizi kontrol edin. Spam klasörünü de kontrol etmeyi unutmayın.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                style={styles.input}
                required
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
            </button>
          </form>
        )}

        <p style={styles.footer}>
          Şifrenizi hatırladınız mı?{' '}
          <Link to="/giris" style={styles.link}>Giriş Yap</Link>
        </p>
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
    maxWidth: '400px',
    width: '100%',
    backdropFilter: 'blur(10px)',
  },
  backLink: {
    color: '#a0a0a0',
    fontSize: '0.9rem',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#a0a0a0',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: '500',
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
  error: {
    color: '#ff4757',
    fontSize: '0.9rem',
    margin: 0,
  },
  button: {
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%)',
    color: '#000',
    border: 'none',
    borderRadius: '0.75rem',
    cursor: 'pointer',
  },
  successBox: {
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    border: '1px solid #00ff9d',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  successText: {
    color: '#00ff9d',
    margin: 0,
    marginBottom: '0.5rem',
  },
  infoText: {
    color: '#a0a0a0',
    fontSize: '0.9rem',
    margin: 0,
  },
  footer: {
    textAlign: 'center',
    marginTop: '2rem',
    color: '#a0a0a0',
  },
  link: {
    color: '#00ff9d',
    textDecoration: 'none',
  },
};
