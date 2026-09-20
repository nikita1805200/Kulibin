const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'qwen2.5:7b';

let cachedModels = null;
let lastCheckTime = 0;

/**
 * Получение списка загруженных в Ollama моделей
 */
async function getAvailableModels() {
  if (cachedModels && (Date.now() - lastCheckTime < 15000)) {
    return cachedModels;
  }
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, { signal: ctrl.signal });
    clearTimeout(timer);

    if (!res.ok) return cachedModels || [];
    const data = await res.json();
    cachedModels = (data.models || []).map(m => m.name);
    lastCheckTime = Date.now();
    return cachedModels;
  } catch {
    return cachedModels || [];
  }
}

/**
 * Определение лучшей доступной модели
 */
async function getBestModel() {
  const models = await getAvailableModels();
  if (models.length === 0) return DEFAULT_MODEL;

  // 1. Ищем 14b модель если есть
  const model14b = models.find(m => m.includes('14b'));
  if (model14b) return model14b;

  // 2. Ищем qwen2.5 (например, qwen2.5:7b)
  const qwenModel = models.find(m => m.includes('qwen2.5'));
  if (qwenModel) return qwenModel;

  // 3. Ищем точное совпадение с дефолтной моделью
  if (models.includes(DEFAULT_MODEL)) return DEFAULT_MODEL;

  // 4. Ищем qwen или llama
  const fallback = models.find(m => m.includes('qwen') || m.includes('llama'));
  return fallback || models[0];
}

/**
 * Проверка статуса сервиса Ollama и выбранной модели
 */
async function checkStatus() {
  const models = await getAvailableModels();
  const connected = models.length > 0;
  const activeModel = await getBestModel();

  return {
    connected,
    host: OLLAMA_HOST,
    targetModel: DEFAULT_MODEL,
    activeModel,
    isModelAvailable: connected,
    availableModels: models
  };
}

/**
 * Отправка чат-запроса в Ollama
 */
async function chat(messages, options = {}) {
  const model = options.model || (await getBestModel());
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
