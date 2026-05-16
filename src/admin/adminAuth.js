export const ADMIN_SESSION_KEY = 'adminSession';
export const ADMIN_PASSWORD_HASH_KEY = 'adminPasswordHash';
export const ADMIN_DEFAULT_PASSWORD = 'furkan2026';

export const hashPassword = async (pwd) => {
  const enc = new TextEncoder().encode(pwd);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const updateAdminPassword = async (newPwd) => {
  const hash = await hashPassword(newPwd);
  localStorage.setItem(ADMIN_PASSWORD_HASH_KEY, hash);
};
