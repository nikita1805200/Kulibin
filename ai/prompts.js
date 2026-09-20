const SYSTEM_PROMPT = `Ты — ведущий эксперт-методист ФИПИ и преподаватель платформы «Кулибин».
Составляй качественные учебные задания (ОГЭ, ЕГЭ или школьная программа) с точным числовым ответом и кратким пошаговым решением.
Ответ возвращай строго в формате JSON.`;

/**
 * Быстрый компактный промпт для оперативной генерации
 */
function buildTaskPrompt({ subjectName, grade, topic, examType, fewShotExamples = [] }) {
  const ex = fewShotExamples[0];
  let exampleText = '';
  if (ex) {
    exampleText = `Образец задачи:\nТема: ${ex.topic}\nУсловие: ${ex.condition}\nРешение: ${ex.solution}\nОтвет: ${ex.answer}\n\n`;
  }

  const userContent = `${exampleText}Составь НОВУЮ аналогичную задачу:
- Предмет: ${subjectName}
- Класс: ${grade}
- Тема: ${topic}

Формат JSON:
{
  "title": "${subjectName}: ${topic}",
  "examType": "${examType ? examType.toUpperCase() : 'ТРЕНАЖЕР'}",
  "grade": ${grade},
  "question": "Текст условия задачи с конкретными числами",
  "hints": ["Краткая подсказка к первому шагу"],
  "solution": "Пошаговое решение с вычислениями",
  "answer": "Точный ответ",
  "criteria": "1 балл",
  "difficulty": "базовый"
}`;

  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userContent }
  ];
}

module.exports = {
  SYSTEM_PROMPT,
  buildTaskPrompt
};
