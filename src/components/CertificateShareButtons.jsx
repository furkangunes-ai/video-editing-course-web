import React, { useState } from 'react';
import { Linkedin, Twitter, Facebook, Link as LinkIcon, Check } from 'lucide-react';

const ORG_NAME = 'Furkan Güneş Eğitim';

const parseCompletionDate = (input) => {
  if (!input) return null;
  const d = new Date(input);
  if (!isNaN(d.getTime())) return d;
  // tr-TR fallback (e.g. "12 Mart 2026")
  const months = ['ocak', 'şubat', 'mart', 'nisan', 'mayıs', 'haziran', 'temmuz', 'ağustos', 'eylül', 'ekim', 'kasım', 'aralık'];
  const parts = String(input).toLowerCase().split(' ');
  if (parts.length === 3) {
    const day = Number(parts[0]);
    const monthIdx = months.indexOf(parts[1]);
    const year = Number(parts[2]);
    if (day && monthIdx >= 0 && year) return new Date(year, monthIdx, day);
  }
  return null;
};

export const CertificateShareButtons = ({ certificate }) => {
  const [copied, setCopied] = useState(false);

  if (!certificate) return null;

  const url = window.location.href;
  const recipient = certificate.recipient_name || '';
  const course = certificate.course_title || '';
  const code = certificate.certificate_code || '';
  const date = parseCompletionDate(certificate.completion_date);

  const linkedInParams = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: course,
    organizationName: ORG_NAME,
    certUrl: url,
    certId: code,
  });
  if (date) {
    linkedInParams.set('issueYear', String(date.getFullYear()));
    linkedInParams.set('issueMonth', String(date.getMonth() + 1));
  }
  const linkedInUrl = `https://www.linkedin.com/profile/add?${linkedInParams.toString()}`;

  const tweetText = `${recipient}, ${course} eğitimini tamamladı! 🎓`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // older browsers / permissions denied — fallback
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* noop */ }
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="cert-share">
      <h3 className="cert-share-title">Profiline / sosyal medyana ekle</h3>
      <div className="cert-share-grid">
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cert-share-btn cert-share-linkedin"
        >
          <Linkedin size={18} />
          <span>LinkedIn profiline ekle</span>
        </a>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cert-share-btn cert-share-twitter"
        >
          <Twitter size={18} />
          <span>Twitter / X'te paylaş</span>
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cert-share-btn cert-share-facebook"
        >
          <Facebook size={18} />
          <span>Facebook'ta paylaş</span>
        </a>
        <button type="button" onClick={copyLink} className="cert-share-btn cert-share-copy">
          {copied ? <Check size={18} /> : <LinkIcon size={18} />}
          <span>{copied ? 'Bağlantı kopyalandı' : 'Bağlantıyı kopyala'}</span>
        </button>
      </div>

      <style>{`
        .cert-share {
          margin-top: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1rem;
          width: 100%;
          max-width: 600px;
        }
        .cert-share-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          margin: 0 0 1.25rem;
        }
        .cert-share-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.6rem;
        }
        .cert-share-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.6rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          font-family: inherit;
          transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease;
          text-decoration: none;
          text-align: center;
        }
        .cert-share-btn:hover {
          transform: translateY(-1px);
        }
        .cert-share-linkedin:hover { background: #0a66c2; border-color: #0a66c2; }
        .cert-share-twitter:hover { background: #1d9bf0; border-color: #1d9bf0; }
        .cert-share-facebook:hover { background: #1877f2; border-color: #1877f2; }
        .cert-share-copy:hover {
          background: rgba(0, 255, 157, 0.15);
          border-color: #00ff9d;
          color: #00ff9d;
        }
      `}</style>
    </div>
  );
};
