/**
 * VideoMaster Auth API Client
 */

const API_BASE_URL = 'https://videomaster-backend-production.up.railway.app';

// Token yönetimi için yardımcı fonksiyonlar
const TOKEN_KEY = 'token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  // Token 7 gün geçerli (backend ile uyumlu)
  const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
}

function getToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

  if (!token) return null;

  // Token süresi dolmuşsa temizle
  if (expiry && Date.now() > parseInt(expiry)) {
    clearToken();
    return null;
  }

  return token;
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

/**
 * Kullanıcı kaydı
 */
export async function register(email, password, fullName) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, full_name: fullName }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Kayıt başarısız');
  }

  return data;
}

/**
 * Kullanıcı girişi
 */
export async function login(email, password) {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Giriş başarısız');
  }

  // Token'ı kaydet
  setToken(data.access_token);
  return data;
}

/**
 * Mevcut kullanıcı bilgisi
 */
export async function getMe() {
  const token = getToken();

  if (!token) {
    throw new Error('Giriş yapılmamış');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Ağ hatası olmadan response geldiyse
    if (!response.ok) {
      // 401 veya 403 ise token geçersiz
      if (response.status === 401 || response.status === 403) {
        clearToken();
        throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
      }
      const data = await response.json();
      throw new Error(data.detail || 'Kullanıcı bilgisi alınamadı');
    }

    return await response.json();
  } catch (error) {
    // Ağ hatası
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Bağlantı hatası. İnternet bağlantınızı kontrol edin.');
    }
    throw error;
  }
}

/**
 * Çıkış yap
 */
export function logout() {
  clearToken();
}

/**
 * Token var mı kontrol et
 */
export function isLoggedIn() {
  return !!getToken();
}

/**
 * Email doğrulama
 */
export async function verifyEmail(email, code) {
  const response = await fetch(`${API_BASE_URL}/api/auth/verify-email?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`, {
    method: 'POST',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Doğrulama başarısız');
  }

  return data;
}

/**
 * Doğrulama kodunu tekrar gönder
 */
export async function resendCode(email) {
  const response = await fetch(`${API_BASE_URL}/api/auth/resend-code?email=${encodeURIComponent(email)}`, {
    method: 'POST',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Kod gönderilemedi');
  }

  return data;
}
