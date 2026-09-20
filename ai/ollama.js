const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'qwen2.5-coder:14b';

/**
 * Получение списка загруженных в Ollama моделей
 */
async function getAvailableModels() {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, { signal: ctrl.signal });
    clearTimeout(timer);

    if (!res.ok) return [];
    const data = await res.json();
    return (data.models || []).map(m => m.name);
  } catch {
    return [];
  }
}

/**
 * Проверка статуса сервиса Ollama и выбранной модели
 */
async function checkStatus() {
  const models = await getAvailableModels();
  const connected = models.length > 0;
  const isDefaultLoaded = models.some(m => m === DEFAULT_MODEL || m.startsWith(DEFAULT_MODEL.split(':')[0]));

  return {
    connected,
    host: OLLAMA_HOST,
    targetModel: DEFAULT_MODEL,
    isModelAvailable: isDefaultLoaded,
    availableModels: models
  };
}

/**
 * Отправка чат-запроса в Ollama
 */
async function chat(messages, options = {}) {
  const model = options.model || DEFAULT_MODEL;
  const temperature = options.temperature ?? 0.4;
  const format = options.format ?? 'json';
  const timeoutMs = options.timeoutMs || 60000;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  const startTime = Date.now();

  try {
    const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        model,
        messages,
        format,
        stream: false,
        options: { temperature }
      })
    });

    clearTimeout(timer);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Ollama HTTP ${res.status}: ${errText || res.statusText}`);
    }

    const data = await res.json();
    return {
      content: data.message?.content || '',
      model: data.model || model,
      durationMs: Date.now() - startTime
    };
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

module.exports = {
  OLLAMA_HOST,
  DEFAULT_MODEL,
  getAvailableModels,
  checkStatus,
  chat
};
