const APP_ID = process.env.MAX_APP_ID || '51950000';
const APP_URL = process.env.MAX_APP_URL || 'http://localhost:3000';

function getBotKeyboard() {
  return {
    inline: true,
    buttons: [
      [
        {
          action: {
            type: 'open_app',
            app_id: Number(APP_ID),
            label: '⚡ Открыть тренажер «Кулибин»',
            hash: 'generator'
          }
        }
      ],
      [
        {
          action: {
            type: 'text',
            label: '📚 Случайная задача',
            payload: JSON.stringify({ command: 'task' })
          },
          color: 'primary'
        },
        {
          action: {
            type: 'text',
            label: '❓ Помощь',
            payload: JSON.stringify({ command: 'help' })
          },
          color: 'secondary'
        }
      ]
    ]
  };
}

function handleMessage(text = '', payload = null) {
  const normalized = text.trim().toLowerCase();
  
  if (normalized === '/start' || normalized === 'старт' || normalized === 'меню') {
    return {
      text: 'Привет! Я бот образовательной платформы «Кулибин: Траектория» для Сферум / MAX.\n\nНажмите кнопку ниже, чтобы открыть интерактивный тренажер ОГЭ/ЕГЭ с подсказками и решениями.',
      keyboard: getBotKeyboard()
    };
  }

  if (normalized === '/help' || normalized === 'помощь' || payload?.command === 'help') {
    return {
      text: 'Команды бота:\n• /start — главное меню и запуск приложения\n• /task — получить быструю тренировочную задачу\n• /app — ссылка на запуск мини-приложения',
      keyboard: getBotKeyboard()
    };
  }

  return {
    text: 'Выберите действие в меню или запустите интерактивный тренажер «Кулибин»:',
    keyboard: getBotKeyboard()
  };
}

module.exports = {
  getBotKeyboard,
  handleMessage
};
