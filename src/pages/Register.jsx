import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://videomaster-backend-production.up.railway.app';

export function Register() {
  const [step, setStep] = useState(1); // 1: kayıt formu, 2: doğrulama kodu
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2);
      } else {
        setError(data.detail || 'Kayıt başarısız');
      }
    } catch (err) {
      setError('Sunucuya bağlanılamadı');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/verify-email?email=${encodeURIComponent(email)}&code=${encodeURIComponent(verificationCode)}`,
        { method: 'POST' }
      );

      const data = await response.json();

      if (response.ok && data.verified) {
        navigate('/giris', { state: { message: 'Email doğrulandı! Artık giriş yapabilirsiniz.' } });
      } else {
        setError(data.detail || 'Doğrulama başarısız');
      }
    } catch (err) {
      setError('Sunucuya bağlanılamadı');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/resend-code?email=${encodeURIComponent(email)}`,
        { method: 'POST' }
      );

      const data = await response.json();

      if (response.ok) {
        setError(''); // Clear any error
        alert('Yeni doğrulama kodu gönderildi!');
      } else {
        setError(data.detail || 'Kod gönderilemedi');
      }
    } catch (err) {
      setError('Sunucuya bağlanılamadı');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Doğrulama kodu ekranı
  if (step === 2) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <button onClick={() => setStep(1)} style={styles.backLink}>← Geri</button>

          <div style={styles.iconWrapper}>
            <div style={styles.emailIcon}>✉️</div>
          </div>

          <h1 style={styles.title}>Email Doğrulama</h1>
          <p style={styles.subtitle}>
            <strong style={{ color: '#fff' }}>{email}</strong> adresine 6 haneli doğrulama kodu gönderdik.
          </p>

          <form onSubmit={handleVerify} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Doğrulama Kodu</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                style={styles.codeInput}
                maxLength={6}
                required
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: loading || verificationCode.length !== 6 ? 0.7 : 1,
              }}
              disabled={loading || verificationCode.length !== 6}
            >
              {loading ? 'Doğrulanıyor...' : 'Doğrula'}
            </button>
          </form>

          <p style={styles.resendText}>
            Kod gelmedi mi?{' '}
            <button onClick={handleResendCode} style={styles.resendButton} disabled={loading}>
              Tekrar Gönder
            </button>
          </p>

          <p style={styles.timerText}>
            Kod 15 dakika içinde geçerliliğini yitirecektir.
          </p>
        </div>
      </div>
    );
  }

  // Step 1: Kayıt formu
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Link to="/" style={styles.backLink}>← Ana Sayfa</Link>

        <h1 style={styles.title}>Kayıt Ol</h1>
        <p style={styles.subtitle}>Yeni hesap oluşturun</p>

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Ad Soyad</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Adınız Soyadınız"
              style={styles.input}
              required
            />
          </div>

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

          <div style={styles.inputGroup}>
            <label style={styles.label}>Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Şifre Tekrar</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
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
            {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p style={styles.footer}>
          Zaten hesabınız var mı?{' '}
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
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    textAlign: 'left',
  },
  iconWrapper: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  emailIcon: {
    fontSize: '4rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  subtitle: {
    color: '#a0a0a0',
    marginBottom: '2rem',
    textAlign: 'center',
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
  codeInput: {
    padding: '1.5rem',
    fontSize: '2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid rgba(0, 255, 157, 0.3)',
    borderRadius: '0.75rem',
    color: '#00ff9d',
    outline: 'none',
    textAlign: 'center',
    letterSpacing: '0.5rem',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  error: {
    color: '#ff4757',
    fontSize: '0.9rem',
    margin: 0,
    textAlign: 'center',
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
  footer: {
    textAlign: 'center',
    marginTop: '2rem',
    color: '#a0a0a0',
  },
  link: {
    color: '#00ff9d',
    textDecoration: 'none',
  },
  resendText: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#a0a0a0',
  },
  resendButton: {
    color: '#00ff9d',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: 'inherit',
  },
  timerText: {
    textAlign: 'center',
    marginTop: '1rem',
    color: '#ff4757',
    fontSize: '0.85rem',
  },
};
