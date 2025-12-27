const API_BASE_URL = 'https://videomaster-backend-production.up.railway.app';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function getCourses() {
  const response = await fetch(`${API_BASE_URL}/api/courses/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Kurslar yüklenemedi');
  return response.json();
}

export async function getCourse(courseId) {
  const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Kurs bulunamadı');
  return response.json();
}

export async function getLessonVideo(lessonId) {
  const response = await fetch(`${API_BASE_URL}/api/videos/lesson/${lessonId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Video yüklenemedi');
  }
  return response.json();
}

export async function updateProgress(lessonId, watchedSeconds, completed = false) {
  const response = await fetch(`${API_BASE_URL}/api/courses/progress`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      lesson_id: lessonId,
      watched_seconds: watchedSeconds,
      completed,
    }),
  });
  if (!response.ok) throw new Error('İlerleme kaydedilemedi');
  return response.json();
}

export async function getMyProgress() {
  const response = await fetch(`${API_BASE_URL}/api/courses/progress/me`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('İlerleme yüklenemedi');
  return response.json();
}
