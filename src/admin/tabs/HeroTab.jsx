import React from 'react';
import { Section, Field, Row, TextInput, Textarea, FormStyles } from '../FormControls';

export const HeroTab = ({ config, updateConfig }) => {
  return (
    <>
      <FormStyles />

      <Section title="Hero Bölümü" description="Site açılışındaki ilk büyük blok.">
        <Field label="Üst Rozet" hint="Başlığın üstündeki küçük metin.">
          <TextInput
            value={config.hero.badge}
            onChange={(v) => updateConfig('hero.badge', v)}
            placeholder="Yeni Başlayanlar İçin Özel"
          />
        </Field>

        <Row>
          <Field label="Başlık - 1. Satır">
            <TextInput
              value={config.hero.titleLine1}
              onChange={(v) => updateConfig('hero.titleLine1', v)}
              placeholder="Video Editörlüğü ile"
            />
          </Field>
          <Field label="Başlık - 2. Satır" hint="Renkli vurgulu satır.">
            <TextInput
              value={config.hero.titleLine2}
              onChange={(v) => updateConfig('hero.titleLine2', v)}
              placeholder="Gelirinizi İkiye Katlayın"
            />
          </Field>
        </Row>

        <Field label="Alt Açıklama">
          <Textarea
            value={config.hero.subtitle}
            onChange={(v) => updateConfig('hero.subtitle', v)}
            placeholder="Editörlük, doğru stratejilerle..."
            rows={3}
          />
        </Field>

        <Field label="Garanti Metni" hint="CTA'ların altındaki küçük yazı.">
          <TextInput
            value={config.hero.guaranteeText}
            onChange={(v) => updateConfig('hero.guaranteeText', v)}
            placeholder="* %96 Memnuniyet Garantisi"
          />
        </Field>

        <Field
          label="Örnek Ders Video URL"
          hint="YouTube veya Vimeo linki. Boş bırakılırsa modal placeholder gösterir."
        >
          <TextInput
            value={config.hero.sampleVideoUrl}
            onChange={(v) => updateConfig('hero.sampleVideoUrl', v)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </Field>
      </Section>
    </>
  );
};
