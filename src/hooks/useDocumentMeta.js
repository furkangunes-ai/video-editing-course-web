import { useEffect } from 'react';

const SET_TAGS = new Set();

const setMeta = (key, value, { attr = 'name' } = {}) => {
  if (!value) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
  SET_TAGS.add(`${attr}:${key}`);
};

export const useDocumentMeta = ({ title, description, image, url, type = 'article' }) => {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = title;

    if (description) setMeta('description', description);

    if (title) {
      setMeta('og:title', title, { attr: 'property' });
      setMeta('twitter:title', title);
    }
    if (description) {
      setMeta('og:description', description, { attr: 'property' });
      setMeta('twitter:description', description);
    }
    if (image) {
      setMeta('og:image', image, { attr: 'property' });
      setMeta('twitter:image', image);
    }
    if (url) {
      setMeta('og:url', url, { attr: 'property' });
      setMeta('twitter:url', url);
    }
    setMeta('og:type', type, { attr: 'property' });

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, image, url, type]);
};

export const setJsonLd = (id, data) => {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
};

export const removeJsonLd = (id) => {
  const el = document.getElementById(id);
  if (el) el.remove();
};

export const useJsonLd = (id, data) => {
  useEffect(() => {
    if (!data) return;
    setJsonLd(id, data);
    return () => removeJsonLd(id);
  }, [id, data]);
};
