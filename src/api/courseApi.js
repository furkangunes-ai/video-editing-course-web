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
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Video yüklenemedi');
  }
  const lesson = await response.json();
  // Frontend'in beklediği formata dönüştür
  return {
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    embed_url: lesson.video_url, // Bunny.net embed URL
    duration_seconds: lesson.duration_seconds,
    is_free: lesson.is_free
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
