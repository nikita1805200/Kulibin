const DEFAULT_TAXONOMY = {
  math: {
    name: 'Математика',
    grades: [5, 6],
    topics: {
      5: ['Десятичные дроби', 'Текстовые задачи на движение', 'Уравнения и формулы'],
      6: ['Обыкновенные дроби', 'Пропорции и проценты', 'Отрицательные числа']
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
  gradeSelect.innerHTML = current.grades.map(g => '<option value="' + g + '">' + g + ' класс</option>').join('');
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
    const subject = document.getElementById('gen-subject').value;
    const grade = document.getElementById('gen-grade').value;
    const topic = document.getElementById('gen-topic').value;
    const customTopic = document.getElementById('gen-custom-topic').value.trim();
    btn.disabled = true;
    btn.textContent = 'Генерация...';
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, grade, topic, customTopic })
      });
      const task = await res.json();
      renderGeneratedTask(task);
    } catch (err) {
      renderGeneratedTask({
        title: (taxonomyData[subject]?.name || 'Задание') + ' (' + grade + ' класс)',
        question: 'Тренировочное задание по теме: ' + (customTopic || topic) + '. Найдите значение выражения или решите поставленную задачу.',
        answer: 'Ответ зависит от решения'
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
  card.innerHTML = '<h3>' + task.title + '</h3>' +
    '<p style="margin: 0.75rem 0; line-height: 1.5;">' + task.question + '</p>' +
    '<div class="form-group">' +
    '  <label for="user-answer">Ваш ответ</label>' +
    '  <input type="text" id="user-answer" class="form-control" placeholder="Введите ответ">' +
    '</div>' +
    '<div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">' +
    '  <button id="btn-check-answer" class="primary-btn">Проверить ответ</button>' +
    '  <button id="btn-show-answer" class="tab-btn" style="border: 1px solid var(--border-color);">Показать эталон</button>' +
    '</div>' +
    '<div id="answer-feedback" style="margin-top: 0.75rem; display: none; padding: 0.75rem; border-radius: 8px;"></div>';

  document.getElementById('btn-check-answer').onclick = () => {
    const userVal = document.getElementById('user-answer').value.trim().toLowerCase();
    const correctVal = String(task.answer || '').trim().toLowerCase();
    const feedback = document.getElementById('answer-feedback');
    feedback.style.display = 'block';
    if (userVal && (userVal === correctVal || correctVal.includes(userVal))) {
      feedback.style.background = 'rgba(46, 160, 67, 0.15)';
      feedback.style.border = '1px solid #2ea043';
      feedback.style.color = '#3fb950';
      feedback.textContent = 'Верно! Отличный результат.';
    } else {
      feedback.style.background = 'rgba(248, 81, 73, 0.15)';
      feedback.style.border = '1px solid #f85149';
      feedback.style.color = '#f85149';
      feedback.textContent = 'Неверно. Попробуйте еще раз или посмотрите эталон.';
    }
  };

  document.getElementById('btn-show-answer').onclick = () => {
    const feedback = document.getElementById('answer-feedback');
    feedback.style.display = 'block';
    feedback.style.background = 'var(--bg-primary)';
    feedback.style.border = '1px solid var(--border-color)';
    feedback.style.color = 'var(--text-primary)';
    feedback.textContent = 'Правильный ответ: ' + task.answer;
  };
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  populateSubjects();
  initPresets();
  initGenerator();
});
