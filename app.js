const subjects = [
  { id: 'math', name: 'Математика', icon: '📐' },
  { id: 'algebra', name: 'Алгебра', icon: '📊' },
  { id: 'geometry', name: 'Геометрия', icon: '📏' },
  { id: 'physics', name: 'Физика', icon: '⚡' },
  { id: 'cs', name: 'Информатика', icon: '💻' },
  { id: 'chemistry', name: 'Химия', icon: '🧪' }
];

let taxonomyData = {};

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

function renderSubjects() {
  const container = document.getElementById('subjects-grid');
  if (!container) return;
  container.innerHTML = '';
  subjects.forEach(sub => {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.innerHTML = '<div class="subject-icon">' + sub.icon + '</div><div class="subject-info"><span class="subject-title">' + sub.name + '</span></div>';
    card.addEventListener('click', () => {
      const tabBtn = document.querySelector('[data-tab="generator"]');
      if (tabBtn) tabBtn.click();
      const subjectSelect = document.getElementById('gen-subject');
      if (subjectSelect) {
        subjectSelect.value = sub.id;
        updateGrades();
      }
    });
    container.appendChild(card);
  });
}

async function loadTaxonomy() {
  try {
    const res = await fetch('/api/taxonomy');
    if (!res.ok) return;
    taxonomyData = await res.json();
    populateSubjects();
  } catch (err) {
    console.error(err);
  }
}

function populateSubjects() {
  const subjectSelect = document.getElementById('gen-subject');
  if (!subjectSelect) return;
  subjectSelect.innerHTML = Object.keys(taxonomyData).map(k => '<option value="' + k + '">' + taxonomyData[k].name + '</option>').join('');
  subjectSelect.addEventListener('change', updateGrades);
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
      alert('Ошибка при генерации задачи');
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
  renderSubjects();
  loadTaxonomy();
  initPresets();
  initGenerator();
});
