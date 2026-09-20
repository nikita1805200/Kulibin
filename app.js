const DEFAULT_TAXONOMY = {
  math: {
    name: 'Математика',
    grades: [5, 6, 7, 8, 9, 10, 11],
    topics: {
      5: ['Десятичные дроби', 'Текстовые задачи на движение', 'Уравнения и формулы'],
      6: ['Обыкновенные дроби', 'Пропорции и проценты', 'Отрицательные числа'],
      7: ['Линейные уравнения', 'Одночлены и многочлены', 'Формулы сокращенного умножения'],
      8: ['Квадратные корни', 'Квадратные уравнения', 'Теорема Пифагора'],
      9: ['Системы уравнений', 'Числовые прогрессии', 'Неравенства второй степени'],
      10: ['Тригонометрические функции', 'Тригонометрические уравнения', 'Производная функции'],
      11: ['Первообразная и интеграл', 'Показательные и логарифмические уравнения', 'Стереометрия']
    }
  },
  algebra: {
    name: 'Алгебра',
    grades: [7, 8, 9, 10, 11],
    topics: {
      7: ['Линейные уравнения', 'Одночлены и многочлены', 'Формулы сокращенного умножения'],
      8: ['Квадратные корни', 'Квадратные уравнения', 'Квадратичная функция'],
      9: ['Системы уравнений', 'Арифметическая прогрессия', 'Геометрическая прогрессия'],
      10: ['Тригонометрические функции', 'Тригонометрические уравнения', 'Производная функции'],
      11: ['Первообразная и интеграл', 'Показательные уравнения', 'Логарифмические уравнения']
    }
  },
  geometry: {
    name: 'Геометрия',
    grades: [7, 8, 9, 10, 11],
    topics: {
      7: ['Смежные и вертикальные углы', 'Признаки равенства треугольников', 'Параллельные прямые'],
      8: ['Параллелограмм и трапеция', 'Теорема Пифагора', 'Площади многоугольников'],
      9: ['Теорема синусов и косинусов', 'Длина окружности и площадь круга', 'Векторы на плоскости'],
      10: ['Аксиомы стереометрии', 'Параллельность прямых и плоскостей', 'Перпендикулярность в пространстве'],
      11: ['Многогранники и тела вращения', 'Объемы тел', 'Векторы и координаты в пространстве']
    }
  },
  physics: {
    name: 'Физика',
    grades: [7, 8, 9, 10, 11],
    topics: {
      7: ['Плотность вещества', 'Давление твердых тел и жидкостей', 'Закон Архимеда'],
      8: ['Тепловые явления и теплоемкость', 'Закон Ома', 'Параллельное и последовательное соединение'],
      9: ['Законы Ньютона', 'Импульс тела и закон сохранения', 'Механические колебания и волны'],
      10: ['Кинематика и динамика', 'Молекулярно-кинетическая теория', 'Термодинамика'],
      11: ['Электромагнитная индукция', 'Колебательный контур', 'Квантовая и ядерная физика']
    }
  },
  cs: {
    name: 'Информатика',
    grades: [7, 8, 9, 10, 11],
    topics: {
      7: ['Кодирование текстовой информации', 'Единицы измерения информации', 'Файловая система'],
      8: ['Системы счисления', 'Элементы математической логики', 'Алгоритмы и блок-схемы'],
      9: ['Основы языка Python', 'Ветвления и циклы', 'Обработка числовых массивов'],
      10: ['Двоичное кодирование звука и графики', 'Таблицы истинности', 'Сложные условия'],
      11: ['Динамическое программирование', 'Рекурсивные алгоритмы', 'Теория графов и деревья']
    }
  },
  chemistry: {
    name: 'Химия',
    grades: [8, 9, 10, 11],
    topics: {
      8: ['Строение атома', 'Периодический закон', 'Химические формулы и уравнения'],
      9: ['Электролитическая диссоциация', 'Свойства металлов и неметаллов', 'Окислительно-восстановительные реакции'],
      10: ['Предельные углеводороды (Алканы)', 'Непредельные углеводороды', 'Спирты и альдегиды'],
      11: ['Химическое равновесие', 'Скорость химических реакций', 'Гидролиз солей']
    }
  },
  biology: {
    name: 'Биология',
    grades: [5, 6, 7, 8, 9, 10, 11],
    topics: {
      5: ['Клеточное строение организмов', 'Царства живой природы'],
      6: ['Органы цветкового растения', 'Фотосинтез и дыхание растений'],
      7: ['Многообразие животных', 'Тип Членистоногие'],
      8: ['Анатомия человека: кровеносная система', 'Нервная система и анализаторы'],
      9: ['Основы генетики: законы Менделя', 'Эволюция живой природы'],
      10: ['Цитология: структура и функции клетки', 'Биосинтез белка'],
      11: ['Экологические факторы и экосистемы', 'Биосфера и ноосфера']
    }
  },
  history: {
    name: 'История',
    grades: [5, 6, 7, 8, 9, 10, 11],
    topics: {
      5: ['Древний Египет и Месопотамия', 'Древняя Греция и Рим'],
      6: ['Образование Древнерусского государства', 'Раздробленность на Руси'],
      7: ['Эпоха Ивана Грозного', 'Смутное время в России'],
      8: ['Реформы Петра I', 'Эпоха Просвещения и Екатерина II'],
      9: ['Отечественная война 1812 года', 'Отмена крепостного права 1861 года'],
      10: ['Первая мировая война и революция 1917', 'СССР в 1920-1930-е годы'],
      11: ['Великая Отечественная война 1941-1945', 'Россия в конце XX — начале XXI века']
    }
  }
};

let taxonomyData = DEFAULT_TAXONOMY;

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn:not(.preset-btn)');
  const tabPanes = document.querySelectorAll('.tab-pane');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const activePane = document.getElementById(targetTab + '-tab');
      if (activePane) activePane.classList.add('active');
    });
  });
}

function populateSubjects() {
  const subjectSelect = document.getElementById('gen-subject');
  if (!subjectSelect) return;
  subjectSelect.innerHTML = Object.keys(taxonomyData).map(k => '<option value="' + k + '">' + taxonomyData[k].name + '</option>').join('');
  subjectSelect.onchange = updateGrades;
  updateGrades();
}

function updateGrades() {
  const subjectSelect = document.getElementById('gen-subject');
  const gradeSelect = document.getElementById('gen-grade');
  if (!subjectSelect || !gradeSelect) return;
  const current = taxonomyData[subjectSelect.value];
  if (!current) return;
  
  const prevGrade = gradeSelect.value;
  gradeSelect.innerHTML = current.grades.map(g => '<option value="' + g + '">' + g + ' класс</option>').join('');
  if (current.grades.includes(Number(prevGrade))) {
    gradeSelect.value = prevGrade;
  }
  gradeSelect.onchange = updateTopics;
  updateTopics();
}

function updateTopics() {
  const subjectSelect = document.getElementById('gen-subject');
  const gradeSelect = document.getElementById('gen-grade');
  const topicSelect = document.getElementById('gen-topic');
  if (!subjectSelect || !gradeSelect || !topicSelect) return;
  const current = taxonomyData[subjectSelect.value];
  if (!current) return;
  const topics = current.topics[gradeSelect.value] || [];
  topicSelect.innerHTML = topics.map(t => '<option value="' + t + '">' + t + '</option>').join('');
}

function initPresets() {
  const presetBtns = document.querySelectorAll('.preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const subject = btn.dataset.subject;
      const grade = btn.dataset.grade;
      const topic = btn.dataset.topic;

      const subjectSelect = document.getElementById('gen-subject');
      if (subjectSelect) {
        subjectSelect.value = subject;
        updateGrades();
      }
      const gradeSelect = document.getElementById('gen-grade');
      if (gradeSelect) {
        gradeSelect.value = grade;
        updateTopics();
      }
      const topicSelect = document.getElementById('gen-topic');
      if (topicSelect && topic) {
        topicSelect.value = topic;
      }
    });
  });
}

function initGenerator() {
  const btn = document.getElementById('btn-generate-task');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const exam = document.getElementById('gen-exam')?.value || '';
    const subject = document.getElementById('gen-subject').value;
    const grade = document.getElementById('gen-grade').value;
    const topic = document.getElementById('gen-topic').value;
    const customTopic = document.getElementById('gen-custom-topic').value.trim();
    btn.disabled = true;
    btn.textContent = 'Генерация через ИИ...';
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exam, subject, grade, topic, customTopic })
      });
      const task = await res.json();
      renderGeneratedTask(task);
    } catch (err) {
      renderGeneratedTask({
        title: (taxonomyData[subject]?.name || 'Задание') + ' (' + grade + ' класс)',
        examType: 'ТРЕНАЖЕР',
        question: 'Тренировочное задание по теме: ' + (customTopic || topic) + '. Найдите значение выражения или решите поставленную задачу.',
        hints: ['Используйте базовые формулы темы.'],
        solution: 'Пошаговое решение формируется.',
        answer: '42',
        criteria: '1 балл'
      });
    } finally {
      btn.disabled = false;
      btn.textContent = 'Сгенерировать задание';
    }
  });
}

function renderGeneratedTask(task) {
  let card = document.getElementById('task-result-card');
  if (!card) {
    card = document.createElement('div');
    card.id = 'task-result-card';
    card.className = 'generator-card';
    card.style.marginTop = '1.5rem';
    document.getElementById('generator-tab').appendChild(card);
  }

  const examBadge = task.examType ? `<span class="badge-exam">${task.examType}</span>` : '';
  const diffBadge = task.difficulty ? `<span class="badge-diff">${task.difficulty}</span>` : '';
  const hintsHtml = task.hints && task.hints.length > 0 ? `
    <details class="hint-details" style="margin-top: 0.75rem;">
      <summary style="cursor: pointer; color: var(--accent-color); font-size: 0.85rem; font-weight: 500;">💡 Показать подсказку</summary>
      <div class="hint-box" style="margin-top: 0.5rem; padding: 0.6rem 0.85rem; background: var(--bg-primary); border-radius: 8px; font-size: 0.875rem; border: 1px solid var(--border-color);">
        ${task.hints.join('<br>')}
      </div>
    </details>` : '';

  card.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
      <h3 style="font-size: 1.15rem; margin: 0;">${task.title}</h3>
      <div style="display: flex; gap: 0.4rem;">${examBadge}${diffBadge}</div>
    </div>
    <div class="task-question" style="margin: 0.75rem 0; line-height: 1.6; white-space: pre-line; background: var(--bg-primary); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
      ${task.question}
    </div>
    ${hintsHtml}
    <div class="form-group" style="margin-top: 0.75rem;">
      <label for="user-answer">Ваш ответ:</label>
      <input type="text" id="user-answer" class="form-control" placeholder="Введите полученный ответ">
    </div>
    <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem; flex-wrap: wrap;">
      <button id="btn-check-answer" class="primary-btn">Проверить ответ</button>
      <button id="btn-toggle-solution" class="tab-btn" style="border: 1px solid var(--border-color);">Пошаговое решение</button>
    </div>
    <div id="answer-feedback" style="margin-top: 0.75rem; display: none; padding: 0.75rem; border-radius: 8px;"></div>
    <div id="solution-section" style="display: none; margin-top: 1rem; padding: 1rem; background: var(--bg-primary); border-radius: 8px; border: 1px solid var(--border-color);">
      <h4 style="color: var(--accent-color); margin-bottom: 0.5rem;">📝 Пошаговое решение (ФИПИ):</h4>
      <p style="white-space: pre-line; line-height: 1.5; font-size: 0.9rem; margin-bottom: 0.75rem;">${task.solution || 'Решение доступно выше.'}</p>
      <div style="border-top: 1px solid var(--border-color); padding-top: 0.5rem; display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary);">
        <span><strong>Эталонный ответ:</strong> <code style="color: #58a6ff;">${task.answer}</code></span>
        <span>${task.criteria || '1 балл'}</span>
      </div>
    </div>
  `;

  document.getElementById('btn-check-answer').onclick = () => {
    const userVal = document.getElementById('user-answer').value.trim().toLowerCase();
    const correctVal = String(task.answer || '').trim().toLowerCase();
    const feedback = document.getElementById('answer-feedback');
    feedback.style.display = 'block';
    if (userVal && (userVal === correctVal || correctVal.includes(userVal))) {
      feedback.style.background = 'rgba(46, 160, 67, 0.15)';
      feedback.style.border = '1px solid #2ea043';
      feedback.style.color = '#3fb950';
      feedback.textContent = '🎉 Верно! Отличный результат.';
    } else {
      feedback.style.background = 'rgba(248, 81, 73, 0.15)';
      feedback.style.border = '1px solid #f85149';
      feedback.style.color = '#f85149';
      feedback.textContent = '❌ Неверно. Проверьте расчеты или откройте «Пошаговое решение».';
    }
  };

  document.getElementById('btn-toggle-solution').onclick = () => {
    const solSec = document.getElementById('solution-section');
    solSec.style.display = solSec.style.display === 'none' ? 'block' : 'none';
  };
}

async function checkAiStatus() {
  const badge = document.getElementById('ai-status-badge');
  const text = document.getElementById('ai-status-text');
  if (!badge || !text) return;
  try {
    const res = await fetch('/api/ai/status');
    if (res.ok) {
      const data = await res.json();
      if (data.ai?.connected) {
        badge.classList.add('online');
        text.textContent = `Qwen 2.5 14B (${data.fipi?.total || 0} ФИПИ)`;
      } else {
        text.textContent = `ФИПИ База (${data.fipi?.total || 0} задач)`;
      }
    }
  } catch {}
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  populateSubjects();
  initPresets();
  initGenerator();
  checkAiStatus();
});

