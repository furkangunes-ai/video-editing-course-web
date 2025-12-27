/**
 * VideoMaster Auth API Client
 */

const API_BASE_URL = 'https://videomaster-backend-production.up.railway.app';

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

  // Token'ı localStorage'a kaydet
  localStorage.setItem('token', data.access_token);
  return data;
}

/**
 * Mevcut kullanıcı bilgisi
 */
export async function getMe() {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Giriş yapılmamış');
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    localStorage.removeItem('token');
    throw new Error(data.detail || 'Oturum geçersiz');
  }

  return data;
}

/**
 * Çıkış yap
 */
export function logout() {
  localStorage.removeItem('token');
}

/**
 * Token var mı kontrol et
 */
export function isLoggedIn() {
  return !!localStorage.getItem('token');
}
