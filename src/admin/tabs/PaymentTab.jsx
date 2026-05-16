import React from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { Section, Field, Row, TextInput, Toggle, FormStyles, Badge } from '../FormControls';

export const PaymentTab = ({ config, updateConfig }) => {
  const payment = config.payment;

  return (
    <>
      <FormStyles />

      <div className="payment-roadmap">
        <div className="roadmap-icon"><CreditCard size={20} /></div>
        <div>
          <strong>Ödeme entegrasyonu yol haritası</strong>
          <p>
            iyzico entegrasyonu önümüzdeki hafta aktif olacak. Bu sekme şimdiden API
            anahtarlarını saklamanı sağlıyor; entegrasyon tamamlandığında Pricing
            kartındaki "Hemen Kaydol" butonu otomatik olarak iyzico checkout sayfasına
            yönlendirilecek.
          </p>
        </div>

        <style>{`
          .payment-roadmap {
            display: flex;
            gap: 1rem;
            align-items: flex-start;
            padding: 1.25rem;
            background: linear-gradient(135deg, rgba(0, 255, 157, 0.05), rgba(112, 0, 255, 0.05));
            border: 1px solid rgba(0, 255, 157, 0.2);
            border-radius: var(--radius-md);
            margin-bottom: 2rem;
          }
          .roadmap-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(0, 255, 157, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-primary);
            flex-shrink: 0;
          }
          .payment-roadmap strong { font-size: 0.95rem; }
          .payment-roadmap p {
            margin: 0.35rem 0 0;
            font-size: 0.85rem;
            color: var(--color-text-muted);
            line-height: 1.6;
          }
        `}</style>
      </div>

      <Section
        title={(
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            iyzico <Badge kind={payment.iyzicoEnabled ? 'success' : 'pending'}>{payment.iyzicoEnabled ? 'Aktif' : 'Beklemede'}</Badge>
          </span>
        )}
        description="Türkiye için kredi kartı ödemeleri. API anahtarlarını iyzico Merchant panelinden alabilirsin."
      >
        <Toggle
          value={payment.iyzicoEnabled}
          onChange={(v) => updateConfig('payment.iyzicoEnabled', v)}
          label="iyzico ile ödeme almayı etkinleştir"
        />

        <Toggle
          value={payment.iyzicoSandbox}
          onChange={(v) => updateConfig('payment.iyzicoSandbox', v)}
          label="Sandbox modu (test API)"
        />

        <Row>
          <Field label="API Key" hint="iyzico Merchant panelinden alın.">
            <TextInput
              type="password"
              value={payment.iyzicoApiKey}
              onChange={(v) => updateConfig('payment.iyzicoApiKey', v)}
              placeholder="sandbox-AAAAA... veya canlı"
            />
          </Field>
          <Field label="Secret Key">
            <TextInput
              type="password"
              value={payment.iyzicoSecretKey}
              onChange={(v) => updateConfig('payment.iyzicoSecretKey', v)}
              placeholder="sandbox-XXXXX..."
            />
          </Field>
        </Row>

        <div className="security-note">
          <Lock size={14} />
          <p>
            <strong>Güvenlik:</strong> Bu anahtarlar tarayıcı localStorage'ında tutuluyor —
            iyzico checkout entegrasyonu bittiğinde anahtarları sunucu tarafına taşıyacağız.
            Şimdilik sadece sandbox anahtarlarını gir.
          </p>
        </div>

        <style>{`
          .security-note {
            display: flex;
            gap: 0.6rem;
            align-items: flex-start;
            padding: 0.85rem 1rem;
            background: rgba(255, 165, 0, 0.05);
            border: 1px solid rgba(255, 165, 0, 0.2);
            border-radius: var(--radius-sm);
            color: orange;
          }
          .security-note p {
            margin: 0;
            font-size: 0.82rem;
            color: var(--color-text-muted);
            line-height: 1.6;
          }
          .security-note strong { color: orange; }
        `}</style>
      </Section>

      <Section
        title={(
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Stripe (Opsiyonel) <Badge kind="pending">Beklemede</Badge>
          </span>
        )}
        description="Yurt dışı ödemeler için Stripe entegrasyonuna yer ayrıldı. iyzico bittikten sonra eklenebilir."
      >
        <Toggle
          value={payment.stripeEnabled}
          onChange={(v) => updateConfig('payment.stripeEnabled', v)}
          label="Stripe ile ödeme almayı etkinleştir"
        />
        <Field label="Stripe Publishable Key">
          <TextInput
            value={payment.stripePublicKey}
            onChange={(v) => updateConfig('payment.stripePublicKey', v)}
            placeholder="pk_live_..."
          />
        </Field>
      </Section>
    </>
  );
};
