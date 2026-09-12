const subjects = [
  { id: 'math', name: 'Математика', icon: '📐', count: '12 тем' },
  { id: 'cs', name: 'Информатика', icon: '💻', count: '8 тем' },
  { id: 'physics', name: 'Физика', icon: '⚡', count: '10 тем' },
  { id: 'chemistry', name: 'Химия', icon: '🧪', count: '9 тем' },
  { id: 'biology', name: 'Биология', icon: '🧬', count: '11 тем' },
  { id: 'russian', name: 'Русский язык', icon: '📝', count: '14 тем' },
  { id: 'literature', name: 'Литература', icon: '📚', count: '7 тем' },
  { id: 'history', name: 'История', icon: '🏛️', count: '15 тем' },
  { id: 'social', name: 'Обществознание', icon: '⚖️', count: '10 тем' },
  { id: 'geography', name: 'География', icon: '🌍', count: '6 тем' },
  { id: 'english', name: 'Английский язык', icon: '🇬🇧', count: '16 тем' },
  { id: 'german', name: 'Немецкий язык', icon: '🇩🇪', count: '8 тем' },
  { id: 'french', name: 'Французский язык', icon: '🇫🇷', count: '7 тем' },
  { id: 'spanish', name: 'Испанский язык', icon: '🇪🇸', count: '6 тем' }
];

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

  subjects.forEach(subject => {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.dataset.id = subject.id;

    card.innerHTML = `
      <div class="subject-icon">${subject.icon}</div>
      <div class="subject-info">
        <span class="subject-title">${subject.name}</span>
        <span class="subject-count">${subject.count}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      handleSubjectSelect(subject);
    });

    container.appendChild(card);
  });
}

function handleSubjectSelect(subject) {
  console.log('Selected subject:', subject.name);
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  renderSubjects();
});
