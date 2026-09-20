const { SUBJECTS } = require('./taxonomy');
const { getFewShotExamples, getTasksByFilter } = require('./db');
const { buildTaskPrompt } = require('./prompts');
const ollama = require('./ollama');

/**
 * Валидация и нормализация структуры задачи
 */
function normalizeTask(rawTask, context) {
  const { targetSubject, targetTopic, grade, examType } = context;
  return {
    title: String(rawTask.title || `${targetSubject}: ${targetTopic}`).trim(),
    examType: String(rawTask.examType || (examType ? examType.toUpperCase() : 'ТРЕНАЖЕР')).trim(),
    grade: Number(rawTask.grade || grade || 9),
    question: String(rawTask.question || `Решите тренировочную задачу по теме "${targetTopic}".`).trim(),
    hints: Array.isArray(rawTask.hints) ? rawTask.hints.map(String) : [],
    solution: String(rawTask.solution || 'Подробное решение формируется автоматически.').trim(),
    answer: String(rawTask.answer ?? '').trim(),
    criteria: String(rawTask.criteria || '1 балл за правильный ответ.').trim(),
    difficulty: String(rawTask.difficulty || 'базовый').trim(),
    source: rawTask.source || 'ai-qwen2.5-14b'
  };
}

/**
 * Получение эталонной задачи из банка ФИПИ при недоступности нейросети
 */
function getFallbackTask(context) {
  const { subject, grade, targetTopic, examType, targetSubject } = context;
  const matching = getTasksByFilter({ subject, grade, exam: examType, topic: targetTopic });
  
  if (matching.length > 0) {
    const picked = matching[Math.floor(Math.random() * matching.length)];
    return {
      title: `${targetSubject}: ${picked.topic} (ФИПИ ${picked.exam.toUpperCase()})`,
      examType: picked.exam.toUpperCase(),
      grade: picked.grade,
      question: picked.condition,
      hints: ['Внимательно проанализируйте условие и примените формулу.'],
      solution: picked.solution,
      answer: picked.answer,
      criteria: picked.criteria || '1 балл за правильный ответ.',
      difficulty: picked.difficulty === 2 ? 'повышенный' : 'базовый',
      source: 'fipi-database'
    };
  }

  return {
    title: `${targetSubject}: ${targetTopic}`,
    examType: examType ? examType.toUpperCase() : 'ТРЕНАЖЕР',
    grade: Number(grade) || 9,
    question: `Решите задачу по теме "${targetTopic}" для ${grade} класса.`,
    hints: ['Используйте основные свойства и теоремы данной темы.'],
    solution: `Пошаговое решение для темы "${targetTopic}" доступно в учебных материалах.`,
    answer: '42',
    criteria: '1 балл',
    difficulty: 'базовый',
    source: 'template-fallback'
  };
}

/**
 * Основной оркестратор генерации задачи
 */
async function generateTask({ subject, grade, topic, customTopic, exam }) {
  const targetTopic = customTopic || topic || 'Общая тема';
  const subjectMeta = SUBJECTS[subject];
  const targetSubject = subjectMeta?.name || subject || 'Предмет';
  const examType = exam || (Number(grade) === 9 ? 'oge' : (Number(grade) >= 10 ? 'ege' : 'school'));

  const context = { subject, targetSubject, targetTopic, grade: Number(grade) || 9, examType };

  // 1. Извлекаем эталоны ФИПИ для Few-Shot
  const fewShot = getFewShotExamples({
    subject,
    grade: context.grade,
    topic: targetTopic,
    exam: examType,
    limit: 2
  });

  // 2. Формируем промпт
  const messages = buildTaskPrompt({
    subjectName: targetSubject,
    grade: context.grade,
    topic: targetTopic,
    examType,
    fewShotExamples: fewShot
  });

  // 3. Отправляем запрос в Qwen через Ollama
  try {
    const res = await ollama.chat(messages, {
      model: process.env.DEFAULT_MODEL,
      temperature: 0.35,
      timeoutMs: 120000
    });

    // Извлечение JSON из текста
    let content = res.content.trim();
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return normalizeTask({ ...parsed, source: `qwen-14b (${res.model})` }, context);
    }
  } catch (err) {
    console.warn(`[AI Generator] Использован банк ФИПИ (${err.message})`);
  }

  return getFallbackTask(context);
}

module.exports = {
  generateTask,
  normalizeTask,
  getFallbackTask
};
