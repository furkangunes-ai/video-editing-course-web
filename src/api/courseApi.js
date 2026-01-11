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

export async function getLessonVideo(courseId, lessonId) {
  const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/lessons/${lessonId}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Video yuklenemedi');
  }

  // Frontend'in beklediği formata dönüştür
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    embed_url: data.video_url, // Bunny.net embed URL
    duration_seconds: data.duration_seconds,
    is_free: data.is_free
  };
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
