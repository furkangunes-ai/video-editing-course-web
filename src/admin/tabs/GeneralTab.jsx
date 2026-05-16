import React, { useState } from 'react';
import { Section, Field, Row, TextInput, FormStyles } from '../FormControls';
import { updateAdminPassword } from '../adminAuth';

export const GeneralTab = ({ config, updateConfig }) => {
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');

  const changePassword = async (e) => {
    e.preventDefault();
    if (newPwd.length < 6) {
      setPwdMsg('Şifre en az 6 karakter olmalı.');
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg('Şifreler eşleşmiyor.');
      return;
    }
    await updateAdminPassword(newPwd);
    setNewPwd('');
    setConfirmPwd('');
    setPwdMsg('Şifre güncellendi.');
    setTimeout(() => setPwdMsg(''), 2500);
  };

  return (
    <>
      <FormStyles />

      <Section title="Marka" description="Logo metni, ikincil etiket ve telif yılı.">
        <Row>
          <Field label="Marka Adı">
            <TextInput
              value={config.brand.name}
              onChange={(v) => updateConfig('brand.name', v)}
              placeholder="Furkan Güneş"
            />
          </Field>
          <Field label="Etiket" hint="Marka adının yanında küçük yazı (örn. Eğitim).">
            <TextInput
              value={config.brand.tagline}
              onChange={(v) => updateConfig('brand.tagline', v)}
              placeholder="Eğitim"
            />
          </Field>
        </Row>
        <Field label="Telif Yılı">
          <TextInput
            type="number"
            value={config.brand.copyrightYear}
            onChange={(v) => updateConfig('brand.copyrightYear', Number(v) || 2026)}
          />
        </Field>
      </Section>

      <Section title="İletişim" description="Tüm CTA'larda ve footer'da kullanılır.">
        <Row>
          <Field label="WhatsApp" hint="Ülke kodu ile birlikte, sadece rakam (örn. 905011411940).">
            <TextInput
              value={config.contact.whatsapp}
              onChange={(v) => updateConfig('contact.whatsapp', v.replace(/\D/g, ''))}
              placeholder="905011411940"
            />
          </Field>
          <Field label="E-posta">
            <TextInput
              type="email"
              value={config.contact.email}
              onChange={(v) => updateConfig('contact.email', v)}
              placeholder="admin@furkangunes.co"
            />
          </Field>
        </Row>
        <Field label="Instagram Kullanıcı Adı" hint="@ işareti olmadan.">
          <TextInput
            value={config.contact.instagram}
            onChange={(v) => updateConfig('contact.instagram', v.replace('@', ''))}
            placeholder="furkangunes.3"
          />
        </Field>
      </Section>

      <Section
        title="Yönetim Paneli Şifresi"
        description="Yeni bir şifre belirlemek için aşağıyı doldur. Boş kalırsa eski şifre korunur."
      >
        <form onSubmit={changePassword} className="admin-pwd-form">
          <Row>
            <Field label="Yeni Şifre">
              <TextInput type="password" value={newPwd} onChange={setNewPwd} placeholder="En az 6 karakter" />
            </Field>
            <Field label="Yeni Şifre (Tekrar)">
              <TextInput type="password" value={confirmPwd} onChange={setConfirmPwd} />
            </Field>
          </Row>
          {pwdMsg && <p className="admin-pwd-msg">{pwdMsg}</p>}
          <button type="submit" className="admin-pwd-btn">Şifreyi Değiştir</button>
        </form>

        <style>{`
          .admin-pwd-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .admin-pwd-msg {
            font-size: 0.85rem;
            color: var(--color-primary);
            margin: 0;
          }
          .admin-pwd-btn {
            align-self: flex-start;
            padding: 0.6rem 1.2rem;
            background: rgba(0, 255, 157, 0.1);
            color: var(--color-primary);
            border: 1px solid var(--color-primary);
            border-radius: var(--radius-sm);
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }
          .admin-pwd-btn:hover {
            background: rgba(0, 255, 157, 0.2);
          }
        `}</style>
      </Section>
    </>
  );
};
