import { useEffect, useState } from 'react';

const STORAGE_KEY = 'flashSale';

const defaultConfig = {
  enabled: false,
  label: 'Sınırlı Süreli Kampanya',
  endsAt: null,
  ctaText: null,
  ctaUrl: null,
};

const loadConfig = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultConfig;
    const parsed = JSON.parse(raw);
    return { ...defaultConfig, ...parsed };
  } catch {
    return defaultConfig;
  }
};

export const setFlashSaleConfig = (next) => {
  const merged = { ...loadConfig(), ...next };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  window.dispatchEvent(new Event('flashSaleChange'));
};

export const clearFlashSale = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('flashSaleChange'));
};

const computeRemaining = (endsAt) => {
  if (!endsAt) return null;
  const end = new Date(endsAt).getTime();
  if (Number.isNaN(end)) return null;
  const diff = end - Date.now();
  if (diff <= 0) return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  const totalMs = diff;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { expired: false, days, hours, minutes, seconds, totalMs };
};

export const useFlashSale = () => {
  const [config, setConfig] = useState(loadConfig);
  const [remaining, setRemaining] = useState(() => computeRemaining(loadConfig().endsAt));

  useEffect(() => {
    const onChange = () => {
      const next = loadConfig();
      setConfig(next);
      setRemaining(computeRemaining(next.endsAt));
    };
    window.addEventListener('flashSaleChange', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('flashSaleChange', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  useEffect(() => {
    if (!config.enabled || !config.endsAt) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRemaining(null);
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(computeRemaining(config.endsAt));
    const id = setInterval(() => {
      setRemaining(computeRemaining(config.endsAt));
    }, 1000);
    return () => clearInterval(id);
  }, [config.enabled, config.endsAt]);

  const visible = !!config.enabled && !!remaining && !remaining.expired;

  return { config, remaining, visible };
};
