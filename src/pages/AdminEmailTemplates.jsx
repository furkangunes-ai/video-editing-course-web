import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Edit3, Eye, Save, X, RefreshCw, ChevronLeft, Code, FileText } from 'lucide-react';

const API_BASE_URL = 'https://videomaster-backend-production.up.railway.app';

export function AdminEmailTemplates() {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [adminKey, setAdminKey] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Edit form state
    const [editForm, setEditForm] = useState({
        display_name: '',
        subject: '',
        html_content: '',
        description: ''
    });

    // Preview state
    const [previewHtml, setPreviewHtml] = useState('');

    const fetchTemplates = async (key) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/admin/email-templates/?admin_key=${encodeURIComponent(key)}`);

            if (response.status === 403) {
                setError('Yetkisiz erişim');
                return;
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                setTemplates(data);
                setIsAuthenticated(true);
                setError('');
            } else {
                setError('Şablonlar yüklenemedi');
            }
        } catch (err) {
            setError('Bağlantı hatası');
        } finally {
            setLoading(false);
        }
    };

    const seedDefaults = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/admin/email-templates/seed-defaults?admin_key=${encodeURIComponent(adminKey)}`, {
                method: 'POST'
            });
            const data = await response.json();
            setSuccess(`Varsayılan şablonlar oluşturuldu: ${data.created?.join(', ') || 'Hiçbiri'}`);
            fetchTemplates(adminKey);
        } catch (err) {
            setError('Şablonlar oluşturulamadı');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        fetchTemplates(adminKey);
    };

    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template);
        setEditForm({
            display_name: template.display_name,
            subject: template.subject,
            html_content: template.html_content,
            description: template.description || ''
        });
        setEditMode(false);
        setPreviewMode(false);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const response = await fetch(
                `${API_BASE_URL}/api/admin/email-templates/${selectedTemplate.name}?admin_key=${encodeURIComponent(adminKey)}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editForm)
                }
            );

            if (response.ok) {
                const updated = await response.json();
                setTemplates(templates.map(t => t.name === updated.name ? updated : t));
                setSelectedTemplate(updated);
                setSuccess('Şablon kaydedildi!');
                setEditMode(false);
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError('Kaydetme başarısız');
            }
        } catch (err) {
            setError('Kaydetme hatası');
        } finally {
            setSaving(false);
        }
    };

    const handlePreview = () => {
        // Test verileriyle önizleme
        let preview = editForm.html_content;
        const testData = {
            full_name: 'Test Kullanıcı',
            email: 'test@example.com',
            code: '123456',
            reset_link: 'https://example.com/reset',
            set_password_link: 'https://example.com/set-password',
            dashboard_url: 'https://example.com/dashboard',
            course_name: 'Video Editörlüğü Ustalık Sınıfı'
        };

        for (const [key, value] of Object.entries(testData)) {
            preview = preview.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
        }

        setPreviewHtml(preview);
        setPreviewMode(true);
    };

    // Login ekranı
    if (!isAuthenticated) {
        return (
            <div className="admin-container">
                <div className="admin-login">
                    <h1><Mail size={32} /> Email Şablon Yönetimi</h1>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            placeholder="Admin Key"
                            value={adminKey}
                            onChange={(e) => setAdminKey(e.target.value)}
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Yükleniyor...' : 'Giriş'}
                        </button>
                    </form>
                    {error && <p className="error">{error}</p>}
                    <Link to="/" className="back-link">← Ana Sayfaya Dön</Link>
                </div>

                <style>{styles}</style>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1><Mail size={28} /> Email Şablon Yönetimi</h1>
                <div className="header-actions">
                    <button onClick={seedDefaults} className="btn-secondary" disabled={loading}>
                        <RefreshCw size={16} /> Varsayılanları Yükle
                    </button>
                    <Link to="/" className="btn-secondary">← Ana Sayfa</Link>
                </div>
            </div>

            {error && <div className="alert error">{error}</div>}
            {success && <div className="alert success">{success}</div>}

            <div className="templates-layout">
                {/* Sol: Şablon Listesi */}
                <div className="templates-list">
                    <h2>Şablonlar</h2>
                    {templates.length === 0 ? (
                        <p className="empty-text">Henüz şablon yok. Varsayılanları yükleyin.</p>
                    ) : (
                        templates.map(template => (
                            <div
                                key={template.name}
                                className={`template-item ${selectedTemplate?.name === template.name ? 'active' : ''}`}
                                onClick={() => handleSelectTemplate(template)}
                            >
                                <FileText size={18} />
                                <div>
                                    <strong>{template.display_name}</strong>
                                    <small>{template.name}</small>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Sağ: Şablon Detayı / Editör */}
                <div className="template-editor">
                    {!selectedTemplate ? (
                        <div className="no-selection">
                            <Mail size={48} />
                            <p>Düzenlemek için sol taraftan bir şablon seçin</p>
                        </div>
                    ) : previewMode ? (
                        <div className="preview-container">
                            <div className="preview-header">
                                <h2>Önizleme</h2>
                                <button onClick={() => setPreviewMode(false)} className="btn-icon">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="preview-frame">
                                <iframe
                                    srcDoc={previewHtml}
                                    title="Email Preview"
                                    style={{ width: '100%', height: '600px', border: 'none', background: '#fff' }}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="editor-header">
                                <h2>{selectedTemplate.display_name}</h2>
                                <div className="editor-actions">
                                    {!editMode ? (
                                        <>
                                            <button onClick={handlePreview} className="btn-secondary">
                                                <Eye size={16} /> Önizle
                                            </button>
                                            <button onClick={() => setEditMode(true)} className="btn-primary">
                                                <Edit3 size={16} /> Düzenle
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setEditMode(false)} className="btn-secondary">
                                                <X size={16} /> İptal
                                            </button>
                                            <button onClick={handleSave} className="btn-primary" disabled={saving}>
                                                <Save size={16} /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="editor-content">
                                {/* Açıklama */}
                                {selectedTemplate.description && !editMode && (
                                    <p className="template-description">{selectedTemplate.description}</p>
                                )}

                                {/* Değişkenler */}
                                {selectedTemplate.variables && (
                                    <div className="variables-info">
                                        <Code size={14} />
                                        <span>Kullanılabilir değişkenler: </span>
                                        {JSON.parse(selectedTemplate.variables).map((v, i) => (
                                            <code key={i}>{`{${v}}`}</code>
                                        ))}
                                    </div>
                                )}

                                {/* Form */}
                                <div className="form-group">
                                    <label>Görüntülenen Ad</label>
                                    <input
                                        type="text"
                                        value={editForm.display_name}
                                        onChange={(e) => setEditForm({...editForm, display_name: e.target.value})}
                                        disabled={!editMode}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email Konusu</label>
                                    <input
                                        type="text"
                                        value={editForm.subject}
                                        onChange={(e) => setEditForm({...editForm, subject: e.target.value})}
                                        disabled={!editMode}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>HTML İçerik</label>
                                    <textarea
                                        value={editForm.html_content}
                                        onChange={(e) => setEditForm({...editForm, html_content: e.target.value})}
                                        disabled={!editMode}
                                        rows={20}
                                        className="code-editor"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <style>{styles}</style>
        </div>
    );
}

const styles = `
    .admin-container {
        min-height: 100vh;
        background: #0a0a0a;
        color: #fff;
        padding: 2rem;
    }

    .admin-login {
        max-width: 400px;
        margin: 100px auto;
        text-align: center;
    }

    .admin-login h1 {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-bottom: 2rem;
        color: #00ff9d;
    }

    .admin-login form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .admin-login input {
        padding: 1rem;
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 8px;
        color: #fff;
        font-size: 1rem;
    }

    .admin-login button {
        padding: 1rem;
        background: #00ff9d;
        color: #000;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
    }

    .back-link {
        display: inline-block;
        margin-top: 1rem;
        color: #666;
        text-decoration: none;
    }

    .admin-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #333;
    }

    .admin-header h1 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #00ff9d;
    }

    .header-actions {
        display: flex;
        gap: 1rem;
    }

    .btn-primary {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: #00ff9d;
        color: #000;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
    }

    .btn-secondary {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: transparent;
        color: #fff;
        border: 1px solid #333;
        border-radius: 8px;
        cursor: pointer;
        text-decoration: none;
    }

    .btn-icon {
        padding: 0.5rem;
        background: transparent;
        color: #fff;
        border: 1px solid #333;
        border-radius: 8px;
        cursor: pointer;
    }

    .alert {
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
    }

    .alert.error {
        background: rgba(255, 71, 87, 0.1);
        border: 1px solid #ff4757;
        color: #ff4757;
    }

    .alert.success {
        background: rgba(0, 255, 157, 0.1);
        border: 1px solid #00ff9d;
        color: #00ff9d;
    }

    .templates-layout {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 2rem;
        height: calc(100vh - 200px);
    }

    .templates-list {
        background: #141414;
        border-radius: 12px;
        padding: 1.5rem;
        overflow-y: auto;
    }

    .templates-list h2 {
        font-size: 1rem;
        color: #666;
        margin-bottom: 1rem;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .empty-text {
        color: #666;
        font-size: 0.9rem;
    }

    .template-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 8px;
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .template-item:hover {
        border-color: #00ff9d;
    }

    .template-item.active {
        border-color: #00ff9d;
        background: rgba(0, 255, 157, 0.05);
    }

    .template-item svg {
        color: #00ff9d;
    }

    .template-item strong {
        display: block;
        color: #fff;
    }

    .template-item small {
        color: #666;
        font-size: 0.8rem;
    }

    .template-editor {
        background: #141414;
        border-radius: 12px;
        padding: 1.5rem;
        overflow-y: auto;
    }

    .no-selection {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #666;
    }

    .no-selection svg {
        margin-bottom: 1rem;
        opacity: 0.3;
    }

    .editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #333;
    }

    .editor-header h2 {
        color: #fff;
    }

    .editor-actions {
        display: flex;
        gap: 0.5rem;
    }

    .template-description {
        color: #888;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        padding: 1rem;
        background: #1a1a1a;
        border-radius: 8px;
    }

    .variables-info {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        background: rgba(0, 255, 157, 0.05);
        border: 1px solid rgba(0, 255, 157, 0.1);
        border-radius: 8px;
        margin-bottom: 1.5rem;
        font-size: 0.85rem;
        color: #888;
    }

    .variables-info code {
        background: #1a1a1a;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        color: #00ff9d;
        font-family: monospace;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-group label {
        display: block;
        color: #888;
        font-size: 0.85rem;
        margin-bottom: 0.5rem;
    }

    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 0.875rem 1rem;
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 8px;
        color: #fff;
        font-size: 1rem;
    }

    .form-group input:disabled,
    .form-group textarea:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #00ff9d;
    }

    .code-editor {
        font-family: 'Monaco', 'Menlo', monospace;
        font-size: 0.85rem;
        line-height: 1.5;
        resize: vertical;
    }

    .preview-container {
        height: 100%;
    }

    .preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .preview-frame {
        border-radius: 8px;
        overflow: hidden;
    }

    @media (max-width: 900px) {
        .templates-layout {
            grid-template-columns: 1fr;
        }
    }
`;
