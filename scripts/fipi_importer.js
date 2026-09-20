/**
 * Скрипт импорта и пополнения банка заданий ФИПИ (ОГЭ / ЕГЭ)
 * Использование:
 *   node scripts/fipi_importer.js --stats
 *   node scripts/fipi_importer.js --import-samples
 *   node scripts/fipi_importer.js --file path/to/tasks.json
 */

const fs = require('fs');
const path = require('path');
const db = require('../ai/db');

const EXTENDED_SAMPLES = [
  {
    id: "fipi-math-oge-03",
    exam: "oge",
    grade: 9,
    subject: "math",
    topic: "Десятичные дроби",
    taskNumber: 6,
    difficulty: 1,
    condition: "Найдите значение выражения: (1/4 + 0.05) * 8.",
    solution: "1. 1/4 = 0.25.\n2. 0.25 + 0.05 = 0.30.\n3. 0.3 * 8 = 2.4.",
    answer: "2.4",
    criteria: "1 балл за верный числовой ответ."
  },
  {
    id: "fipi-phys-oge-02",
    exam: "oge",
    grade: 9,
    subject: "physics",
    topic: "Плотность вещества",
    taskNumber: 3,
    difficulty: 1,
    condition: "Брусок объемом 0.002 м³ имеет массу 5.4 кг. Какова плотность вещества (в кг/м³), из которого изготовлен брусок?",
    solution: "1. Формула: ρ = m / V.\n2. ρ = 5.4 / 0.002 = 2700 кг/м³.",
    answer: "2700",
    criteria: "1 балл за верный числовой ответ."
  },
  {
    id: "fipi-cs-ege-01",
    exam: "ege",
    grade: 11,
    subject: "cs",
    topic: "Динамическое программирование",
    taskNumber: 23,
    difficulty: 2,
    condition: "Сколько существует программ, которые преобразуют число 2 в число 15, проходя через число 7, с командами: 1. +1; 2. *2?",
    solution: "1. Число путей из 2 в 7 равно 3.\n2. Число путей из 7 в 15 равно 2.\n3. Итого: 3 * 2 = 6.",
    answer: "6",
    criteria: "1 балл за верный ответ."
  }
];

function importBatch(tasks) {
  let count = 0;
  for (const t of tasks) {
    if (t.condition && t.answer && t.subject) {
      db.upsertTask(t);
      count++;
    }
  }
  console.log(`Импортировано заданий: ${count}`);
  console.log('Текущая статистика:', db.getStats());
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--import-samples')) {
    importBatch(EXTENDED_SAMPLES);
    return;
  }

  const fileIdx = args.indexOf('--file');
  if (fileIdx !== -1 && args[fileIdx + 1]) {
    const raw = fs.readFileSync(path.resolve(args[fileIdx + 1]), 'utf-8');
    const data = JSON.parse(raw);
    importBatch(Array.isArray(data) ? data : [data]);
    return;
  }

  console.log('=== Статистика банка ФИПИ ===', db.getStats());
}

if (require.main === module) {
  main();
}

module.exports = { importBatch, EXTENDED_SAMPLES };
