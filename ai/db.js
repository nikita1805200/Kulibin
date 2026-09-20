const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'fipi_tasks.json');

let cache = null;

/**
 * Чтение базы заданий из файла
 */
function loadTasks() {
  if (cache) return cache;
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      cache = JSON.parse(raw);
    } else {
      cache = [];
    }
  } catch (err) {
    console.error('[DB] Ошибка чтения базы ФИПИ:', err.message);
    cache = [];
  }
  return cache;
}

/**
 * Сохранение изменений в файл
 */
function persistTasks(tasks) {
  cache = tasks;
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(tasks, null, 2), 'utf-8');
}

/**
 * Фильтрация заданий
 */
function getTasksByFilter({ subject, grade, exam, topic }) {
  const tasks = loadTasks();
  // Сначала строгий поиск
  let filtered = tasks.filter(t => {
    if (subject && t.subject !== subject) return false;
    if (exam && t.exam !== exam) return false;
    if (grade && Number(t.grade) !== Number(grade)) return false;
    if (topic && t.topic && !t.topic.toLowerCase().includes(topic.toLowerCase()) && !topic.toLowerCase().includes(t.topic.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (filtered.length > 0) return filtered;

  // Мягкий поиск: по предмету и совпадению темы (игнорируя несовпадение ОГЭ/ЕГЭ)
  if (topic) {
    filtered = tasks.filter(t => 
      (subject ? t.subject === subject : true) &&
      t.topic && (t.topic.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(t.topic.toLowerCase()))
    );
    if (filtered.length > 0) return filtered;
  }

  // Если нет точной темы, берем по предмету
  if (subject) {
    filtered = tasks.filter(t => t.subject === subject);
    if (filtered.length > 0) return filtered;
  }

  return tasks;
}

/**
 * Получение эталонов для Few-Shot промпта нейросети
 */
function getFewShotExamples({ subject, grade, topic, exam, limit = 2 }) {
  const allTasks = loadTasks();
  if (allTasks.length === 0) return [];

  // Поиск по предмету и совпадению темы
  let matched = allTasks.filter(t => 
    t.subject === subject &&
    (topic ? (t.topic.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(t.topic.toLowerCase())) : true)
  );

  // Если совпадений мало, берем по предмету
  if (matched.length < limit) {
    const bySubject = allTasks.filter(t => t.subject === subject && !matched.some(m => m.id === t.id));
    matched = matched.concat(bySubject);
  }

  // Если все еще мало, берем любые задачи
  if (matched.length < limit) {
    const others = allTasks.filter(t => !matched.some(m => m.id === t.id));
    matched = matched.concat(others);
  }

  return matched.slice(0, limit);
}

/**
 * Добавление или обновление задания (для парсера/скрипта)
 */
function upsertTask(task) {
  const tasks = loadTasks();
  const index = tasks.findIndex(t => t.id === task.id || (t.condition === task.condition && t.subject === task.subject));
  if (index >= 0) {
    tasks[index] = { ...tasks[index], ...task };
  } else {
    tasks.push({ id: task.id || `fipi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, ...task });
  }
  persistTasks(tasks);
}

/**
 * Получение статистики по базе
 */
function getStats() {
  const tasks = loadTasks();
  const byExam = { oge: 0, ege: 0 };
  const bySubject = {};

  tasks.forEach(t => {
    if (t.exam) byExam[t.exam] = (byExam[t.exam] || 0) + 1;
    bySubject[t.subject] = (bySubject[t.subject] || 0) + 1;
  });

  return { total: tasks.length, byExam, bySubject };
}

module.exports = {
  loadTasks,
  getTasksByFilter,
  getFewShotExamples,
  upsertTask,
  getStats
};
