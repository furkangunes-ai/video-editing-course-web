import React from 'react';
import { Section, Field, TextInput, FormStyles, Badge } from '../FormControls';

export const AnalyticsTab = ({ config, updateConfig }) => {
  const a = config.analytics;
  const isActive = (v) => (v && v.trim()) ? 'success' : 'pending';
  const statusLabel = (v) => (v && v.trim()) ? 'Aktif' : 'Pasif';

  return (
    <>
      <FormStyles />

      <Section
        title={(
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Google Analytics 4 <Badge kind={isActive(a.ga4Id)}>{statusLabel(a.ga4Id)}</Badge>
          </span>
        )}
        description="ID girildikten sonra sayfa yeniden yüklendiğinde script otomatik çalışır."
      >
        <Field label="Measurement ID" hint="G- ile başlar (örn. G-XXXXXXXXXX).">
          <TextInput
            value={a.ga4Id}
            onChange={(v) => updateConfig('analytics.ga4Id', v.trim())}
            placeholder="G-XXXXXXXXXX"
          />
        </Field>
      </Section>

      <Section
        title={(
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Meta Pixel <Badge kind={isActive(a.metaPixelId)}>{statusLabel(a.metaPixelId)}</Badge>
          </span>
        )}
        description="Facebook & Instagram reklamları için dönüşüm takibi."
      >
        <Field label="Pixel ID" hint="Sadece rakam (örn. 1234567890).">
          <TextInput
            value={a.metaPixelId}
            onChange={(v) => updateConfig('analytics.metaPixelId', v.trim())}
            placeholder="1234567890"
          />
        </Field>
      </Section>

      <Section
        title={(
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Google Tag Manager <Badge kind={isActive(a.gtmId)}>{statusLabel(a.gtmId)}</Badge>
          </span>
        )}
        description="GA4 yerine GTM kullanmayı tercih edersen burayı doldur."
      >
        <Field label="GTM Container ID" hint="GTM- ile başlar.">
          <TextInput
            value={a.gtmId}
            onChange={(v) => updateConfig('analytics.gtmId', v.trim())}
            placeholder="GTM-XXXXXXX"
          />
        </Field>
      </Section>

      <div className="analytics-tip">
        <strong>İpucu:</strong> Kaydet'ten sonra sayfayı yenile (F5). Tracking scriptleri
        yalnızca ID girildiğinde yüklenir, performansı boşa harcamaz.
      </div>

      <style>{`
        .analytics-tip {
          padding: 1rem 1.25rem;
          background: rgba(0, 255, 157, 0.05);
          border: 1px solid rgba(0, 255, 157, 0.2);
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          color: var(--color-text-muted);
          line-height: 1.6;
          margin-top: 1rem;
        }
        .analytics-tip strong { color: var(--color-primary); }
      `}</style>
    </>
  );
};
