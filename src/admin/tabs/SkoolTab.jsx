import React from 'react';
import { Section, Field, Row, TextInput, Toggle, StringList, FormStyles, Badge } from '../FormControls';

export const SkoolTab = ({ config, updateConfig }) => {
  const skool = config.pricing.skool;

  return (
    <>
      <FormStyles />

      <Section
        title="Skool Abonelik Paketi"
        description="Aylık ödemeli Skool topluluk kartı. Pricing bölümünde ikinci kart olarak görünür."
      >
        <Toggle
          value={skool.enabled}
          onChange={(v) => updateConfig('pricing.skool.enabled', v)}
          label="Bu paket sitede görünsün"
        />

        <Field label="Plan Adı">
          <TextInput
            value={skool.planName}
            onChange={(v) => updateConfig('pricing.skool.planName', v)}
            placeholder="Skool Topluluk & Abonelik"
          />
        </Field>

        <Row cols={3}>
          <Field label="Eski Fiyat">
            <TextInput
              value={skool.oldPrice}
              onChange={(v) => updateConfig('pricing.skool.oldPrice', v)}
              placeholder="$12"
            />
          </Field>
          <Field label="Güncel Fiyat">
            <TextInput
              value={skool.currentPrice}
              onChange={(v) => updateConfig('pricing.skool.currentPrice', v)}
              placeholder="$5"
            />
          </Field>
          <Field label="Periyot">
            <TextInput
              value={skool.period}
              onChange={(v) => updateConfig('pricing.skool.period', v)}
              placeholder="/ Ay"
            />
          </Field>
        </Row>

        <Field label="Alt Açıklama">
          <TextInput
            value={skool.subtitle}
            onChange={(v) => updateConfig('pricing.skool.subtitle', v)}
            placeholder="Aylık Abonelik. İstediğin zaman iptal et."
          />
        </Field>

        <Field label="Paket Özellikleri">
          <StringList
            value={skool.features}
            onChange={(v) => updateConfig('pricing.skool.features', v)}
            placeholder="örn. Skool Topluluk Erişimi"
          />
        </Field>

        <Row>
          <Field label="CTA Buton Metni">
            <TextInput
              value={skool.ctaText}
              onChange={(v) => updateConfig('pricing.skool.ctaText', v)}
              placeholder="Skool ile Abone Ol"
            />
          </Field>
          <Field
            label="Skool Sayfa Linki"
            hint="Topluluk sayfanın Skool URL'ini buraya yapıştır."
          >
            <TextInput
              value={skool.ctaUrl}
              onChange={(v) => updateConfig('pricing.skool.ctaUrl', v)}
              placeholder="https://www.skool.com/your-community"
            />
          </Field>
        </Row>

        <div className="skool-info">
          <Badge kind="info">Bilgi</Badge>
          <p>
            Skool platformu ödemeyi kendi sayfasında alır. Buradaki link doğru
            ayarlanırsa kullanıcı tek tıkla aboneliğe gider. Aboneliklerin tahsilat,
            iptal ve raporlamasını Skool dashboard'ından takip edebilirsin.
          </p>
        </div>

        <style>{`
          .skool-info {
            display: flex;
            gap: 0.75rem;
            align-items: flex-start;
            padding: 1rem;
            background: rgba(0, 195, 255, 0.05);
            border: 1px solid rgba(0, 195, 255, 0.2);
            border-radius: var(--radius-sm);
          }
          .skool-info p {
            margin: 0;
            font-size: 0.85rem;
            color: var(--color-text-muted);
            line-height: 1.6;
          }
        `}</style>
      </Section>
    </>
  );
};
