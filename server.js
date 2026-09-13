const http = require('http');
const fs = require('fs');
const path = require('path');
const { SUBJECTS } = require('./ai/taxonomy');

const PORT = process.env.PORT || 3000;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'llama3.2:1b';

const MIME_MAP = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

function parseJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  if (pathname.startsWith('/api/')) {
    try {
      if (pathname === '/api/taxonomy' && req.method === 'GET') {
        return sendJson(res, 200, SUBJECTS);
      }

      if (pathname === '/api/ai/generate' && req.method === 'POST') {
        const body = await parseJson(req);
        const { subject, grade, topic, customTopic } = body;
        const targetTopic = customTopic || topic || 'Общая тема';
        const targetSubject = SUBJECTS[subject]?.name || subject || 'Предмет';

        const prompt = `Составь одну учебную задачу по предмету "${targetSubject}" (${grade} класс) на тему "${targetTopic}". Ответ дай в формате JSON: {"title": "Название", "question": "Текст задания", "answer": "Ответ"}`;

        try {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 3000);
          const aiRes = await fetch(`${OLLAMA_HOST}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: ctrl.signal,
            body: JSON.stringify({
              model: DEFAULT_MODEL,
              messages: [{ role: 'user', content: prompt }],
              stream: false
            })
          });
          clearTimeout(timer);

          if (aiRes.ok) {
            const data = await aiRes.json();
            const raw = data.message?.content || '';
            const match = raw.match(/\{[\s\S]*\}/);
            if (match) {
              return sendJson(res, 200, JSON.parse(match[0]));
            }
          }
        } catch {}

        return sendJson(res, 200, {
          title: `${targetSubject}: ${targetTopic}`,
          question: `Решите тренировочную задачу по теме "${targetTopic}" для ${grade} класса.`,
          answer: '42'
        });
      }

      return sendJson(res, 404, { error: 'Route not found' });
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME_MAP[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500);
      return res.end(err.code === 'ENOENT' ? 'Not Found' : 'Server Error');
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
