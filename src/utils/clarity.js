/**
 * Microsoft Clarity API Helper
 * Kullanıcı davranışlarını detaylı takip etmek için
 */

// Clarity yüklenmiş mi kontrol et
const isClarity = () => typeof window !== 'undefined' && typeof window.clarity === 'function';

/**
 * Kullanıcıyı tanımla (login olunca çağır)
 * @param {string} userId - Kullanıcı ID
 * @param {string} email - Kullanıcı email (opsiyonel, friendly name olarak)
 * @param {string} sessionId - Session ID (opsiyonel)
 */
export const identifyUser = (userId, email = null, sessionId = null) => {
  if (!isClarity()) return;

  try {
    window.clarity('identify', String(userId), sessionId, null, email);
    console.log('[Clarity] User identified:', userId);
  } catch (e) {
    console.error('[Clarity] identify error:', e);
  }
};

/**
 * Custom tag ekle (filtreleme için)
 * @param {string} key - Tag anahtarı
 * @param {string|string[]} value - Tag değeri (tekil veya array)
 */
export const setTag = (key, value) => {
  if (!isClarity()) return;

  try {
    window.clarity('set', key, value);
    console.log('[Clarity] Tag set:', key, '=', value);
  } catch (e) {
    console.error('[Clarity] set error:', e);
  }
};

/**
 * Custom event kaydet
 * @param {string} eventName - Olay adı
 */
export const trackEvent = (eventName) => {
  if (!isClarity()) return;

  try {
    window.clarity('event', eventName);
    console.log('[Clarity] Event tracked:', eventName);
  } catch (e) {
    console.error('[Clarity] event error:', e);
  }
};

/**
 * Session'ı önceliklendir (önemli kullanıcılar için)
 * @param {string} reason - Önceliklendirme sebebi
 */
export const upgradeSession = (reason) => {
  if (!isClarity()) return;

  try {
    window.clarity('upgrade', reason);
    console.log('[Clarity] Session upgraded:', reason);
  } catch (e) {
    console.error('[Clarity] upgrade error:', e);
  }
};

/**
 * Çerez onayı ver
 */
export const giveConsent = () => {
  if (!isClarity()) return;

  try {
    window.clarity('consent');
    console.log('[Clarity] Consent given');
  } catch (e) {
    console.error('[Clarity] consent error:', e);
  }
};

// ============ HAZIR EVENT'LER ============

// Sayfa görüntüleme
export const trackPageView = (pageName) => {
  setTag('page', pageName);
  trackEvent(`page_${pageName}`);
};

// Auth events
export const trackLogin = (userId, email) => {
  identifyUser(userId, email);
  setTag('logged_in', 'true');
  trackEvent('login');
  upgradeSession('user_login');
};

export const trackRegister = (userId, email) => {
  identifyUser(userId, email);
  setTag('new_user', 'true');
  trackEvent('register');
  upgradeSession('new_registration');
};

export const trackLogout = () => {
  trackEvent('logout');
  setTag('logged_in', 'false');
};

// Satın alma funnel
export const trackCheckoutStart = (productName, amount) => {
  setTag('checkout_product', productName);
  setTag('checkout_amount', String(amount));
  trackEvent('checkout_start');
  upgradeSession('checkout_started');
};

export const trackEmailVerified = () => {
  trackEvent('email_verified');
};

export const trackPaymentStart = () => {
  trackEvent('payment_start');
  upgradeSession('payment_initiated');
};

export const trackPurchaseComplete = (orderId, amount) => {
  setTag('purchased', 'true');
  setTag('order_id', orderId);
  setTag('purchase_amount', String(amount));
  trackEvent('purchase_complete');
  upgradeSession('purchase_completed');
};

export const trackPurchaseFailed = (reason) => {
  setTag('purchase_failed_reason', reason);
  trackEvent('purchase_failed');
};

// Kurs events
export const trackCourseAccess = (hasAccess) => {
  setTag('has_course_access', hasAccess ? 'true' : 'false');
};

export const trackVideoStart = (lessonId, lessonTitle) => {
  setTag('current_lesson', lessonTitle);
  trackEvent(`video_start_${lessonId}`);
};

export const trackVideoComplete = (lessonId) => {
  trackEvent(`video_complete_${lessonId}`);
};

export const trackVideoProgress = (lessonId, percent) => {
  if (percent === 25 || percent === 50 || percent === 75 || percent === 100) {
    trackEvent(`video_${percent}pct_${lessonId}`);
  }
};

// Engagement events
export const trackScrollDepth = (depth) => {
  if (depth === 25 || depth === 50 || depth === 75 || depth === 100) {
    trackEvent(`scroll_${depth}pct`);
  }
};

export const trackCTAClick = (ctaName) => {
  trackEvent(`cta_click_${ctaName}`);
};

export const trackFAQOpen = (question) => {
  trackEvent('faq_opened');
  setTag('faq_question', question.substring(0, 50));
};

// Error tracking
export const trackError = (errorType, errorMessage) => {
  setTag('error_type', errorType);
  setTag('error_message', errorMessage.substring(0, 100));
  trackEvent('error_occurred');
};

// User properties
export const setUserProperties = (props) => {
  Object.entries(props).forEach(([key, value]) => {
    setTag(key, String(value));
  });
};

export default {
  identifyUser,
  setTag,
  trackEvent,
  upgradeSession,
  giveConsent,
  trackPageView,
  trackLogin,
  trackRegister,
  trackLogout,
  trackCheckoutStart,
  trackEmailVerified,
  trackPaymentStart,
  trackPurchaseComplete,
  trackPurchaseFailed,
  trackCourseAccess,
  trackVideoStart,
  trackVideoComplete,
  trackVideoProgress,
  trackScrollDepth,
  trackCTAClick,
  trackFAQOpen,
  trackError,
  setUserProperties,
};
