export const DEFAULT_CONFIG = {
  brand: {
    name: 'Furkan Güneş',
    tagline: 'Eğitim',
    copyrightYear: 2026,
  },
  contact: {
    whatsapp: '905011411940',
    email: 'admin@furkangunes.co',
    instagram: 'furkangunes.3',
  },
  hero: {
    badge: 'Yeni Başlayanlar İçin Özel',
    titleLine1: 'Video Editörlüğü ile',
    titleLine2: 'Gelirinizi İkiye Katlayın',
    subtitle: 'Editörlük, doğru stratejilerle global bir gelir yoludur. Güzel yemek için en pahalı malzemeler şart değil.',
    guaranteeText: '* %96 Memnuniyet Garantisi',
    sampleVideoUrl: '',
  },
  pricing: {
    main: {
      enabled: true,
      planName: 'Video Editörlüğü Ustalık Sınıfı',
      badge: 'SINIRLI SÜRE İÇİN',
      oldPrice: '5.000 TL',
      currentPrice: '999 TL',
      discountTag: '%80 İNDİRİM',
      subtitle: 'Tek seferlik ödeme. Ömür boyu erişim.',
      features: [
        'Tüm Eğitim Modülleri (7+ Saat)',
        'Premiere Pro Eğitimi',
        'Müşteri Bulma Rehberi (Bonus)',
        'Özel WhatsApp Destek Grubu',
      ],
      ctaText: 'Hemen İndirimli Kaydol',
      ctaUrl: 'https://wa.me/905011411940',
      guaranteeText: 'İlk hafta %70, ilk ay %40 parçalı iade hakkı',
    },
    skool: {
      enabled: true,
      planName: 'Skool Topluluk & Abonelik',
      oldPrice: '$12',
      currentPrice: '$5',
      period: '/ Ay',
      subtitle: 'Aylık Abonelik. İstediğin zaman iptal et.',
      features: [
        'Tüm Eğitim Modülleri (Mevcut + Gelecek)',
        'Skool Topluluk Erişimi',
        'Sürekli Güncel İçerik',
        'Aylık Canlı Yayınlar',
      ],
      ctaText: 'Skool ile Abone Ol',
      ctaUrl: 'https://www.skool.com/',
    },
  },
  payment: {
    iyzicoEnabled: false,
    iyzicoApiKey: '',
    iyzicoSecretKey: '',
    iyzicoSandbox: true,
    stripeEnabled: false,
    stripePublicKey: '',
  },
  analytics: {
    ga4Id: '',
    metaPixelId: '',
    gtmId: '',
  },
  legal: {
    companyName: 'Furkan Güneş',
    address: '',
    taxOffice: '',
    taxNumber: '',
    mersisNumber: '',
  },
};

export const CONFIG_STORAGE_KEY = 'siteConfig';

export const loadConfig = () => {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);
    return deepMerge(DEFAULT_CONFIG, parsed);
  } catch {
    return DEFAULT_CONFIG;
  }
};

export const saveConfig = (config) => {
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new Event('siteConfigChange'));
};

export const resetConfig = () => {
  localStorage.removeItem(CONFIG_STORAGE_KEY);
  window.dispatchEvent(new Event('siteConfigChange'));
};

function deepMerge(base, override) {
  if (base === null || typeof base !== 'object') return override ?? base;
  if (Array.isArray(base)) return Array.isArray(override) ? override : base;
  const result = { ...base };
  if (override && typeof override === 'object') {
    for (const key of Object.keys(override)) {
      result[key] = deepMerge(base[key], override[key]);
    }
  }
  return result;
}
