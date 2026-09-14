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
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const activePane = document.getElementById(`${targetTab}-tab`);
      if (activePane) {
        activePane.classList.add('active');
      }
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
    card.innerHTML = `
      <div class="subject-icon">${sub.icon}</div>
      <div class="subject-info">
        <span class="subject-title">${sub.name}</span>
      </div>
    `;
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

  subjectSelect.innerHTML = Object.keys(taxonomyData).map(k => `<option value="${k}">${taxonomyData[k].name}</option>`).join('');
  subjectSelect.addEventListener('change', updateGrades);
  updateGrades();
}

function updateGrades() {
  const subjectSelect = document.getElementById('gen-subject');
  const gradeSelect = document.getElementById('gen-grade');
  if (!subjectSelect || !gradeSelect) return;

  const current = taxonomyData[subjectSelect.value];
  if (!current) return;

  gradeSelect.innerHTML = current.grades.map(g => `<option value="${g}">${g} класс</option>`).join('');
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
  topicSelect.innerHTML = topics.map(t => `<option value="${t}">${t}</option>`).join('');
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

  card.innerHTML = `
    <h3>${task.title}</h3>
    <p style="margin: 0.75rem 0; line-height: 1.5;">${task.question}</p>
    <div style="background: var(--bg-primary); padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-color);">
      <small style="color: var(--text-secondary);">Ответ: ${task.answer}</small>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  renderSubjects();
  loadTaxonomy();
  initGenerator();
});
