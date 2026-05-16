import React from 'react';
import { Section, Field, Row, TextInput, Textarea, Toggle, StringList, FormStyles } from '../FormControls';

export const PricingTab = ({ config, updateConfig }) => {
  const main = config.pricing.main;

  return (
    <>
      <FormStyles />

      <Section
        title="Ana Paket — Tek Seferlik Kurs"
        description="Hero ve Pricing bölümlerindeki ana ürün kartı."
      >
        <Toggle
          value={main.enabled}
          onChange={(v) => updateConfig('pricing.main.enabled', v)}
          label="Bu paket sitede görünsün"
        />

        <Field label="Plan Adı">
          <TextInput
            value={main.planName}
            onChange={(v) => updateConfig('pricing.main.planName', v)}
            placeholder="Video Editörlüğü Ustalık Sınıfı"
          />
        </Field>

        <Field label="Rozet" hint="Kartın üstündeki turuncu/yeşil etiket. Boş bırakırsan gösterilmez.">
          <TextInput
            value={main.badge}
            onChange={(v) => updateConfig('pricing.main.badge', v)}
            placeholder="SINIRLI SÜRE İÇİN"
          />
        </Field>

        <Row cols={3}>
          <Field label="Eski Fiyat">
            <TextInput
              value={main.oldPrice}
              onChange={(v) => updateConfig('pricing.main.oldPrice', v)}
              placeholder="5.000 TL"
            />
          </Field>
          <Field label="Güncel Fiyat">
            <TextInput
              value={main.currentPrice}
              onChange={(v) => updateConfig('pricing.main.currentPrice', v)}
              placeholder="999 TL"
            />
          </Field>
          <Field label="İndirim Etiketi">
            <TextInput
              value={main.discountTag}
              onChange={(v) => updateConfig('pricing.main.discountTag', v)}
              placeholder="%80 İNDİRİM"
            />
          </Field>
        </Row>

        <Field label="Alt Açıklama">
          <TextInput
            value={main.subtitle}
            onChange={(v) => updateConfig('pricing.main.subtitle', v)}
            placeholder="Tek seferlik ödeme. Ömür boyu erişim."
          />
        </Field>

        <Field label="Paket Özellikleri" hint="Kart altında listelenecek maddeler.">
          <StringList
            value={main.features}
            onChange={(v) => updateConfig('pricing.main.features', v)}
            placeholder="örn. Tüm Eğitim Modülleri (7+ Saat)"
          />
        </Field>

        <Row>
          <Field label="CTA Buton Metni">
            <TextInput
              value={main.ctaText}
              onChange={(v) => updateConfig('pricing.main.ctaText', v)}
              placeholder="Hemen İndirimli Kaydol"
            />
          </Field>
          <Field
            label="CTA Linki"
            hint="iyzico entegrasyonu hazır olduğunda /checkout gibi bir link kullanabilirsin."
          >
            <TextInput
              value={main.ctaUrl}
              onChange={(v) => updateConfig('pricing.main.ctaUrl', v)}
              placeholder="https://wa.me/905011411940"
            />
          </Field>
        </Row>

        <Field label="Garanti Metni" hint="CTA'nın altındaki kalkan ikonlu metin.">
          <Textarea
            value={main.guaranteeText}
            onChange={(v) => updateConfig('pricing.main.guaranteeText', v)}
            placeholder="İlk hafta %70, ilk ay %40 parçalı iade hakkı"
            rows={2}
          />
        </Field>
      </Section>
    </>
  );
};
