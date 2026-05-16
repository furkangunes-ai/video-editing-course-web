import { useEffect, useState } from 'react';
import { loadConfig } from '../config/defaultConfig';

export const useSiteConfig = () => {
  const [config, setConfig] = useState(() => loadConfig());

  useEffect(() => {
    const handleChange = () => setConfig(loadConfig());
    window.addEventListener('siteConfigChange', handleChange);
    window.addEventListener('storage', handleChange);
    return () => {
      window.removeEventListener('siteConfigChange', handleChange);
      window.removeEventListener('storage', handleChange);
    };
  }, []);

  return config;
};
