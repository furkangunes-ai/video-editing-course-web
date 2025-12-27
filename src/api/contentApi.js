/**
 * Instagram İçerik Oluşturma API Client
 */

const API_BASE_URL = 'https://instagram-content-api-production.up.railway.app';

/**
 * Tek seferde içerik oluştur
 */
export async function generateContent(topic) {
  const response = await fetch(`${API_BASE_URL}/api/v1/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Streaming ile adım adım içerik oluştur
 */
export async function generateContentStream(topic, onStepUpdate, onComplete, onError) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/generate/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Stream okuma hatası');
    }

    let finalResult = null;

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));

            if (data.done) {
              if (finalResult) {
                onComplete(finalResult);
              }
              return;
            }

            if (data.error) {
              onError(data.error);
              return;
            }

            onStepUpdate(data);

            if (data.step === 5 && data.status === 'completed') {
              finalResult = data.result;
            }
          } catch (e) {
            // JSON parse hatası - devam et
          }
        }
      }
    }
  } catch (error) {
    onError(error.message || 'Bilinmeyen hata');
  }
}

/**
 * API sağlık kontrolü
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/health`);
    return response.ok;
  } catch {
    return false;
  }
}
