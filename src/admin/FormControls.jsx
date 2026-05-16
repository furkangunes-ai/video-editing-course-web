import React from 'react';

export const Section = ({ title, description, children }) => (
  <section className="admin-section">
    <header className="admin-section-header">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </header>
    <div className="admin-section-body">{children}</div>

    <style>{`
      .admin-section {
        margin-bottom: 2.5rem;
      }
      .admin-section-header {
        margin-bottom: 1.25rem;
      }
      .admin-section-header h2 {
        font-size: 1.2rem;
        margin: 0 0 0.35rem;
      }
      .admin-section-header p {
        font-size: 0.9rem;
        color: var(--color-text-muted);
        margin: 0;
        line-height: 1.5;
      }
      .admin-section-body {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: 1.5rem;
      }
    `}</style>
  </section>
);

export const Field = ({ label, hint, children, span = 1 }) => (
  <label className={`admin-field span-${span}`}>
    <span className="admin-field-label">{label}</span>
    {children}
    {hint && <span className="admin-field-hint">{hint}</span>}

    <style>{`
      .admin-field {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }
      .admin-field-label {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--color-text);
      }
      .admin-field-hint {
        font-size: 0.75rem;
        color: var(--color-text-muted);
        line-height: 1.5;
      }
    `}</style>
  </label>
);

export const Row = ({ children, cols = 2 }) => (
  <div className="admin-row" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
    {children}
    <style>{`
      .admin-row {
        display: grid;
        gap: 1rem;
      }
      @media (max-width: 600px) {
        .admin-row {
          grid-template-columns: 1fr !important;
        }
      }
    `}</style>
  </div>
);

export const TextInput = ({ value, onChange, placeholder, type = 'text' }) => (
  <input
    type={type}
    value={value ?? ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="admin-input"
  />
);

export const Textarea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea
    value={value ?? ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="admin-input admin-textarea"
  />
);

export const Toggle = ({ value, onChange, label }) => (
  <label className="admin-toggle">
    <input
      type="checkbox"
      checked={!!value}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className="admin-toggle-track">
      <span className="admin-toggle-thumb"></span>
    </span>
    {label && <span className="admin-toggle-label">{label}</span>}

    <style>{`
      .admin-toggle {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        cursor: pointer;
        user-select: none;
      }
      .admin-toggle input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }
      .admin-toggle-track {
        width: 40px;
        height: 22px;
        background: #333;
        border-radius: 999px;
        position: relative;
        transition: background 0.2s;
      }
      .admin-toggle-thumb {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 18px;
        height: 18px;
        background: #fff;
        border-radius: 50%;
        transition: transform 0.2s;
      }
      .admin-toggle input:checked + .admin-toggle-track {
        background: var(--color-primary);
      }
      .admin-toggle input:checked + .admin-toggle-track .admin-toggle-thumb {
        transform: translateX(18px);
      }
      .admin-toggle-label {
        font-size: 0.9rem;
      }
    `}</style>
  </label>
);

export const StringList = ({ value = [], onChange, placeholder }) => {
  const handle = (i, v) => {
    const next = [...value];
    next[i] = v;
    onChange(next);
  };
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, '']);

  return (
    <div className="admin-string-list">
      {value.map((v, i) => (
        <div key={i} className="admin-string-row">
          <input
            type="text"
            value={v}
            onChange={(e) => handle(i, e.target.value)}
            placeholder={placeholder}
            className="admin-input"
          />
          <button type="button" onClick={() => remove(i)} className="admin-string-remove">×</button>
        </div>
      ))}
      <button type="button" onClick={add} className="admin-string-add">+ Madde Ekle</button>

      <style>{`
        .admin-string-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .admin-string-row {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .admin-string-row .admin-input { flex: 1; }
        .admin-string-remove {
          width: 32px;
          height: 32px;
          background: rgba(255, 77, 77, 0.1);
          border: 1px solid rgba(255, 77, 77, 0.3);
          border-radius: var(--radius-sm);
          color: #ff7777;
          font-size: 1.2rem;
          line-height: 1;
          cursor: pointer;
          flex-shrink: 0;
        }
        .admin-string-remove:hover {
          background: rgba(255, 77, 77, 0.2);
        }
        .admin-string-add {
          align-self: flex-start;
          padding: 0.4rem 1rem;
          background: rgba(0, 255, 157, 0.08);
          border: 1px dashed rgba(0, 255, 157, 0.3);
          border-radius: var(--radius-sm);
          color: var(--color-primary);
          font-size: 0.85rem;
          cursor: pointer;
        }
        .admin-string-add:hover {
          background: rgba(0, 255, 157, 0.15);
        }
      `}</style>
    </div>
  );
};

// Shared global styling for all inputs (injected once via this module)
export const FormStyles = () => (
  <style>{`
    .admin-input {
      padding: 0.65rem 0.85rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      color: var(--color-text);
      font-size: 0.95rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s, background 0.2s;
      width: 100%;
    }
    .admin-input:focus {
      border-color: var(--color-primary);
      background: rgba(255, 255, 255, 0.06);
    }
    .admin-textarea {
      resize: vertical;
      min-height: 80px;
      line-height: 1.5;
    }
  `}</style>
);

export const Badge = ({ kind = 'info', children }) => (
  <span className={`admin-badge admin-badge-${kind}`}>
    {children}
    <style>{`
      .admin-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.2rem 0.6rem;
        border-radius: 999px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .admin-badge-info { background: rgba(0, 195, 255, 0.1); color: #4cc8ff; border: 1px solid rgba(0, 195, 255, 0.3); }
      .admin-badge-warn { background: rgba(255, 165, 0, 0.1); color: orange; border: 1px solid rgba(255, 165, 0, 0.3); }
      .admin-badge-pending { background: rgba(160, 160, 160, 0.1); color: #aaa; border: 1px solid rgba(160, 160, 160, 0.3); }
      .admin-badge-success { background: rgba(0, 255, 157, 0.1); color: var(--color-primary); border: 1px solid rgba(0, 255, 157, 0.3); }
    `}</style>
  </span>
);
