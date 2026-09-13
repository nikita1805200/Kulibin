export const CONTEXT_THEMES = [
  'космическая инженерия и спутники',
  'робототехника и беспилотный транспорт',
  'разработка игр и компьютерная графика',
  'биоинженерия и медицина',
  'экология и возобновляемая энергетика',
  'финансы, анализ данных и стартапы',
  'спорт, навигация и логистика'
];

export const DIFFICULTY_LEVELS = {
  easy: { name: 'Базовый', steps: '1-2 шага', maxScore: 1 },
  medium: { name: 'Профильный', steps: '3-4 шага', maxScore: 2 },
  hard: { name: 'Олимпиадный', steps: '4-6 шагов', maxScore: 3 }
};

export const SUBJECT_TAXONOMY = {
  math: {
    name: 'Математика',
    topics: [
      { id: 'linear_eq', name: 'Линейные уравнения', grade: 7 },
      { id: 'quadratic_eq', name: 'Квадратные уравнения', grade: 8 },
      { id: 'prob_basics', name: 'Теория вероятностей', grade: 9 },
      { id: 'trig_funcs', name: 'Тригонометрические функции', grade: 10 }
    ]
  },
  cs: {
    name: 'Информатика',
    topics: [
      { id: 'num_systems', name: 'Системы счисления', grade: 8 },
      { id: 'algorithms', name: 'Алгоритмы и блок-схемы', grade: 8 },
      { id: 'python_loops', name: 'Циклы и условия в Python', grade: 9 },
      { id: 'data_structs', name: 'Списки и словари', grade: 10 }
    ]
  },
  physics: {
    name: 'Физика',
    topics: [
      { id: 'kinematics', name: 'Кинематика и скорость', grade: 7 },
      { id: 'dynamics', name: 'Законы Ньютона и сила', grade: 8 },
      { id: 'electricity', name: 'Закон Ома и цепи', grade: 8 },
      { id: 'thermodynamics', name: 'Тепловые явления', grade: 9 }
    ]
  },
  chemistry: {
    name: 'Химия',
    topics: [
      { id: 'periodic_table', name: 'Строение атома и таблица', grade: 8 },
      { id: 'reactions', name: 'Типы химических реакций', grade: 8 },
      { id: 'solutions', name: 'Растворы и массовая доля', grade: 9 }
    ]
  },
  biology: {
    name: 'Биология',
    topics: [
      { id: 'cell_structure', name: 'Строение клетки', grade: 7 },
      { id: 'genetics', name: 'Основы генетики и законы Менделя', grade: 9 },
      { id: 'ecology', name: 'Экосистемы и биогеоценоз', grade: 10 }
    ]
  },
  russian: {
    name: 'Русский язык',
    topics: [
      { id: 'orthography', name: 'Орфография корней и приставок', grade: 7 },
      { id: 'punctuation', name: 'Пунктуация в сложном предложении', grade: 8 },
      { id: 'syntax', name: 'Синтаксический анализ текста', grade: 9 }
    ]
  },
  literature: {
    name: 'Литература',
    topics: [
      { id: 'classic_prose', name: 'Анализ классической прозы', grade: 8 },
      { id: 'poetry_analysis', name: 'Стихотворные размеры и тропы', grade: 9 }
    ]
  },
  history: {
    name: 'История',
    topics: [
      { id: 'ancient_rus', name: 'Древняя Русь IX–XII вв.', grade: 7 },
      { id: 'peter_great', name: 'Эпоха Петра I', grade: 8 },
      { id: 'world_war_2', name: 'Великая Отечественная война', grade: 9 }
    ]
  },
  social: {
    name: 'Обществознание',
    topics: [
      { id: 'economy_basics', name: 'Рыночная экономика и спрос', grade: 8 },
      { id: 'state_law', name: 'Государство и правовая система', grade: 9 }
    ]
  },
  geography: {
    name: 'География',
    topics: [
      { id: 'topography', name: 'Географические координаты и карты', grade: 7 },
      { id: 'climate_zones', name: 'Климатические пояса Земли', grade: 8 }
    ]
  },
  english: {
    name: 'Английский язык',
    topics: [
      { id: 'tenses_simple', name: 'Present/Past/Future Simple', grade: 7 },
      { id: 'conditionals', name: 'Conditionals (0, 1, 2)', grade: 8 },
      { id: 'passive_voice', name: 'Passive Voice', grade: 9 }
    ]
  },
  german: {
    name: 'Немецкий язык',
    topics: [
      { id: 'verb_conjugation', name: 'Спряжение глаголов', grade: 7 },
      { id: 'cases_declension', name: 'Падежи и склонение артиклей', grade: 8 }
    ]
  },
  french: {
    name: 'Французский язык',
    topics: [
      { id: 'passe_compose', name: 'Passé Composé', grade: 8 },
      { id: 'articles_partitives', name: 'Частичные артикли', grade: 7 }
    ]
  },
  spanish: {
    name: 'Испанский язык',
    topics: [
      { id: 'presente_indicativo', name: 'Presente de Indicativo', grade: 7 },
      { id: 'preterito_indefinido', name: 'Pretérito Indefinido', grade: 8 }
    ]
  }
};
