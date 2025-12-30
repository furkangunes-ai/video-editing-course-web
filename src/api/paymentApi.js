const API_BASE_URL = 'https://videomaster-backend-production.up.railway.app';

// Token'ı localStorage'dan al
const getToken = () => localStorage.getItem('token');

// Sipariş oluştur ve Shopier form verilerini al
export const createOrder = async (productId = 'ustalık-sinifi') => {
  const token = getToken();
  if (!token) {
    throw new Error('Giriş yapmanız gerekiyor');
  }

  const response = await fetch(`${API_BASE_URL}/api/payment/create-order?product_id=${productId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Sipariş oluşturulamadı');
  }

  return response.json();
};

// Sipariş durumunu kontrol et
export const getOrderStatus = async (orderCode) => {
  const token = getToken();
  if (!token) {
    throw new Error('Giriş yapmanız gerekiyor');
  }

  const response = await fetch(`${API_BASE_URL}/api/payment/order/${orderCode}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Sipariş bulunamadı');
  }

  return response.json();
};

// Kullanıcının siparişlerini getir
export const getMyOrders = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('Giriş yapmanız gerekiyor');
  }

  const response = await fetch(`${API_BASE_URL}/api/payment/my-orders`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Siparişler getirilemedi');
  }

  return response.json();
};
