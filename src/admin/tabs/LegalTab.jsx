import React, { useState } from 'react';
import { Section, Field, Row, TextInput, FormStyles } from '../FormControls';
import { LegalModal } from '../../components/LegalModal';

export const LegalTab = ({ config, updateConfig }) => {
  const [previewDoc, setPreviewDoc] = useState(null);
  const legal = config.legal;

  return (
    <>
      <FormStyles />

      <Section
        title="Şirket / Satıcı Bilgileri"
        description="Mesafeli Satış Sözleşmesi ve KVKK metinlerinde otomatik olarak görünür."
      >
        <Field label="Şirket / Şahıs Adı">
          <TextInput
            value={legal.companyName}
            onChange={(v) => updateConfig('legal.companyName', v)}
            placeholder="Furkan Güneş"
          />
        </Field>

        <Field label="Açık Adres" hint="Faturalı adres. KVKK metninde görünür.">
          <TextInput
            value={legal.address}
            onChange={(v) => updateConfig('legal.address', v)}
            placeholder="İlçe, İl, Türkiye"
          />
        </Field>

        <Row>
          <Field label="Vergi Dairesi">
            <TextInput
              value={legal.taxOffice}
              onChange={(v) => updateConfig('legal.taxOffice', v)}
              placeholder="Çankaya"
            />
          </Field>
          <Field label="Vergi Numarası / TC">
            <TextInput
              value={legal.taxNumber}
              onChange={(v) => updateConfig('legal.taxNumber', v)}
              placeholder="12345678901"
            />
          </Field>
        </Row>

        <Field label="Mersis Numarası (varsa)">
          <TextInput
            value={legal.mersisNumber}
            onChange={(v) => updateConfig('legal.mersisNumber', v)}
            placeholder="0000000000000000"
          />
        </Field>
      </Section>

      <Section
        title="Yasal Metinleri Önizle"
        description="Aşağıdaki butonlar siteye eklenen sözleşmeleri tıpkı kullanıcıya göründüğü gibi açar. Yayına almadan önce bir hukuk danışmanı ile gözden geçirmen önerilir."
      >
        <div className="legal-preview-actions">
          <button type="button" onClick={() => setPreviewDoc('kvkk')}>KVKK Aydınlatma Metni</button>
          <button type="button" onClick={() => setPreviewDoc('mesafeli')}>Mesafeli Satış Sözleşmesi</button>
          <button type="button" onClick={() => setPreviewDoc('iade')}>İade ve İptal Koşulları</button>
        </div>

        <style>{`
          .legal-preview-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .legal-preview-actions button {
            padding: 0.6rem 1rem;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-sm);
            color: var(--color-text);
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s;
          }
          .legal-preview-actions button:hover {
            border-color: var(--color-primary);
            color: var(--color-primary);
          }
        `}</style>
      </Section>

      <LegalModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
    </>
  );
};
