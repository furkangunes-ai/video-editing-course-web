import React, { useEffect, useState } from 'react';
import { LogOut, Save, RotateCcw, Eye, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { loadConfig, saveConfig, resetConfig } from '../config/defaultConfig';
import {
  ADMIN_SESSION_KEY as SESSION_KEY,
  ADMIN_PASSWORD_HASH_KEY as PASSWORD_HASH_KEY,
  ADMIN_DEFAULT_PASSWORD as DEFAULT_PASSWORD,
  hashPassword,
} from './adminAuth';
import { GeneralTab } from './tabs/GeneralTab';
import { HeroTab } from './tabs/HeroTab';
import { PricingTab } from './tabs/PricingTab';
import { SkoolTab } from './tabs/SkoolTab';
import { PaymentTab } from './tabs/PaymentTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { LegalTab } from './tabs/LegalTab';

const TABS = [
  { id: 'general', label: 'Genel' },
  { id: 'hero', label: 'Hero' },
  { id: 'pricing', label: 'Kurs Fiyatı' },
  { id: 'skool', label: 'Skool Abonelik' },
  { id: 'payment', label: 'Ödeme (iyzico)' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'legal', label: 'Yasal Bilgiler' },
];

export const AdminPanel = ({ onClose }) => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [config, setConfig] = useState(() => loadConfig());
  const [activeTab, setActiveTab] = useState('general');
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const showToast = (kind, msg) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 2500);
  };

  const updateConfig = (path, value) => {
    setConfig((prev) => {
      const next = structuredClone(prev);
      const parts = path.split('.');
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      return next;
    });
    setDirty(true);
  };

  const handleSave = () => {
    saveConfig(config);
    setDirty(false);
    showToast('success', 'Ayarlar kaydedildi.');
  };

  const handleReset = () => {
    if (!confirm('Tüm site ayarları varsayılana dönecek. Emin misin?')) return;
    resetConfig();
    setConfig(loadConfig());
    setDirty(false);
    showToast('success', 'Varsayılan ayarlara dönüldü.');
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  if (!authed) {
    return <LoginScreen onSuccess={() => setAuthed(true)} onClose={onClose} />;
  }

  const props = { config, updateConfig };

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-title">
            <span className="admin-dot"></span>
            Yönetim Paneli
          </h1>
          <span className="admin-subtitle">{config.brand.name} {config.brand.tagline}</span>
        </div>
        <div className="admin-header-right">
          <a href="#/" className="admin-link-btn" title="Siteyi gör">
            <Eye size={16} /> Siteye Dön
          </a>
          <button className="admin-link-btn" onClick={handleReset} title="Varsayılana dön">
            <RotateCcw size={16} /> Sıfırla
          </button>
          <button className="admin-link-btn admin-logout" onClick={handleLogout}>
            <LogOut size={16} /> Çıkış
          </button>
        </div>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`admin-tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </aside>

        <main className="admin-content">
          {activeTab === 'general' && <GeneralTab {...props} />}
          {activeTab === 'hero' && <HeroTab {...props} />}
          {activeTab === 'pricing' && <PricingTab {...props} />}
          {activeTab === 'skool' && <SkoolTab {...props} />}
          {activeTab === 'payment' && <PaymentTab {...props} />}
          {activeTab === 'analytics' && <AnalyticsTab {...props} />}
          {activeTab === 'legal' && <LegalTab {...props} />}
        </main>
      </div>

      <footer className={`admin-footer ${dirty ? 'dirty' : ''}`}>
        <span className="admin-footer-status">
          {dirty ? (
            <><AlertCircle size={14} /> Kaydedilmemiş değişiklikler var</>
          ) : (
            <><CheckCircle2 size={14} /> Tüm değişiklikler kaydedildi</>
          )}
        </span>
        <button className="admin-save-btn" onClick={handleSave} disabled={!dirty}>
          <Save size={16} /> Kaydet
        </button>
      </footer>

      {toast && (
        <div className={`admin-toast ${toast.kind}`}>
          {toast.kind === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <style>{`
        .admin-shell {
          position: fixed;
          inset: 0;
          background: #0a0a0a;
          color: var(--color-text);
          z-index: 100000;
          display: flex;
          flex-direction: column;
          font-family: var(--font-sans);
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: linear-gradient(145deg, #161616, #0d0d0d);
          border-bottom: 1px solid var(--color-border);
        }

        .admin-header-left {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .admin-title {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 1.1rem;
          margin: 0;
          font-weight: 600;
        }

        .admin-dot {
          width: 8px;
          height: 8px;
          background: var(--color-primary);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--color-primary);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .admin-subtitle {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        .admin-header-right {
          display: flex;
          gap: 0.5rem;
        }

        .admin-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-sm);
          color: var(--color-text-muted);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .admin-link-btn:hover {
          color: var(--color-text);
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.06);
        }

        .admin-logout:hover {
          color: #ff7777;
          border-color: rgba(255, 77, 77, 0.4);
        }

        .admin-body {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .admin-sidebar {
          width: 220px;
          background: #0d0d0d;
          border-right: 1px solid var(--color-border);
          padding: 1rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          overflow-y: auto;
        }

        .admin-tab {
          padding: 0.75rem 1.5rem;
          text-align: left;
          color: var(--color-text-muted);
          font-size: 0.95rem;
          font-weight: 500;
          border: none;
          background: none;
          cursor: pointer;
          border-left: 2px solid transparent;
          transition: all 0.2s;
          font-family: inherit;
        }

        .admin-tab:hover {
          background: rgba(255, 255, 255, 0.04);
          color: var(--color-text);
        }

        .admin-tab.active {
          background: rgba(0, 255, 157, 0.08);
          color: var(--color-primary);
          border-left-color: var(--color-primary);
        }

        .admin-content {
          flex: 1;
          padding: 2rem 2.5rem;
          overflow-y: auto;
          background: #0a0a0a;
        }

        .admin-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 2rem;
          background: #0d0d0d;
          border-top: 1px solid var(--color-border);
          transition: background 0.3s;
        }

        .admin-footer.dirty {
          background: linear-gradient(to right, rgba(255, 165, 0, 0.05), rgba(255, 165, 0, 0.02));
          border-top-color: rgba(255, 165, 0, 0.3);
        }

        .admin-footer-status {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .admin-footer.dirty .admin-footer-status {
          color: orange;
        }

        .admin-save-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.4rem;
          background: linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%);
          color: black;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 0.9rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .admin-save-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .admin-save-btn:not(:disabled):hover {
          box-shadow: 0 0 20px rgba(0, 255, 157, 0.4);
          transform: translateY(-1px);
        }

        .admin-toast {
          position: fixed;
          bottom: 5rem;
          right: 2rem;
          padding: 0.8rem 1.2rem;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          z-index: 100001;
          animation: slideIn 0.3s ease;
        }

        .admin-toast.success {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .admin-toast.error {
          border-color: #ff4d4d;
          color: #ff4d4d;
        }

        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @media (max-width: 768px) {
          .admin-header { padding: 0.75rem 1rem; flex-wrap: wrap; gap: 0.75rem; }
          .admin-header-right { flex-wrap: wrap; }
          .admin-link-btn { font-size: 0.75rem; padding: 0.4rem 0.8rem; }
          .admin-body { flex-direction: column; }
          .admin-sidebar {
            width: 100%;
            flex-direction: row;
            overflow-x: auto;
            padding: 0.5rem;
            border-right: none;
            border-bottom: 1px solid var(--color-border);
          }
          .admin-tab {
            white-space: nowrap;
            padding: 0.6rem 1rem;
            border-left: none;
            border-bottom: 2px solid transparent;
            font-size: 0.85rem;
          }
          .admin-tab.active {
            border-left-color: transparent;
            border-bottom-color: var(--color-primary);
          }
          .admin-content { padding: 1.25rem; }
          .admin-footer { padding: 0.75rem 1rem; }
        }
      `}</style>
    </div>
  );
};

const LoginScreen = ({ onSuccess, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem(PASSWORD_HASH_KEY)) {
        const hash = await hashPassword(DEFAULT_PASSWORD);
        localStorage.setItem(PASSWORD_HASH_KEY, hash);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const stored = localStorage.getItem(PASSWORD_HASH_KEY);
    const tryHash = await hashPassword(password);
    if (stored === tryHash) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onSuccess();
    } else {
      setError('Şifre hatalı.');
    }
  };

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-icon">
          <Lock size={28} />
        </div>
        <h2 className="login-title">Yönetim Paneli</h2>
        <p className="login-subtitle">Devam etmek için şifreni gir.</p>
        <input
          type="password"
          autoFocus
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        {error && <p className="login-error">{error}</p>}
        <button type="submit" className="login-btn">Giriş Yap</button>
        <a href="#/" onClick={onClose} className="login-cancel">İptal</a>
        <p className="login-hint">
          İlk girişte varsayılan şifre: <code>{DEFAULT_PASSWORD}</code><br />
          (Admin → Genel sekmesinden değiştir.)
        </p>
      </form>

      <style>{`
        .login-shell {
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at center, #0f0f0f, #050505);
          z-index: 100000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          background: linear-gradient(145deg, #161616, #0d0d0d);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
        }

        .login-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(0, 255, 157, 0.1);
          border: 1px solid rgba(0, 255, 157, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
          margin-bottom: 0.5rem;
        }

        .login-title {
          font-size: 1.4rem;
          margin: 0;
        }

        .login-subtitle {
          color: var(--color-text-muted);
          font-size: 0.9rem;
          margin: 0 0 0.5rem;
        }

        .login-input {
          width: 100%;
          padding: 0.8rem 1rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          color: var(--color-text);
          font-size: 1rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }

        .login-input:focus {
          border-color: var(--color-primary);
        }

        .login-error {
          color: #ff7777;
          font-size: 0.85rem;
          margin: 0;
        }

        .login-btn {
          width: 100%;
          padding: 0.85rem;
          background: linear-gradient(135deg, #00ff9d 0%, #00cc7d 100%);
          color: black;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .login-btn:hover {
          box-shadow: 0 0 20px rgba(0, 255, 157, 0.4);
          transform: translateY(-1px);
        }

        .login-cancel {
          color: var(--color-text-muted);
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }

        .login-cancel:hover {
          color: var(--color-text);
        }

        .login-hint {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-align: center;
          margin-top: 0.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border);
          width: 100%;
          line-height: 1.6;
        }

        .login-hint code {
          background: rgba(0, 255, 157, 0.1);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          color: var(--color-primary);
          font-family: monospace;
        }
      `}</style>
    </div>
  );
};

