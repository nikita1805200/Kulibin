const http = require('http');
const fs = require('fs');
const path = require('path');
const { SUBJECTS } = require('./ai/taxonomy');
const { generateTask } = require('./ai/generator');
const { checkStatus } = require('./ai/ollama');
const { getStats } = require('./ai/db');
const { handleMessage } = require('./bot/bot');

const PORT = process.env.PORT || 3000;
const START_TIME = Date.now();

const MIME_MAP = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

function getHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'X-Frame-Options': 'ALLOWALL',
    'Content-Security-Policy': 'frame-ancestors *;'
  };
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...getHeaders()
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
    res.writeHead(204, getHeaders());
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  if (pathname.startsWith('/api/')) {
    try {
      if (pathname === '/api/health' && req.method === 'GET') {
        return sendJson(res, 200, {
          status: 'ok',
          uptime: Math.floor((Date.now() - START_TIME) / 1000)
        });
      }

      if (pathname === '/api/taxonomy' && req.method === 'GET') {
        return sendJson(res, 200, SUBJECTS);
      }

      if (pathname === '/api/ai/status' && req.method === 'GET') {
        const aiStatus = await checkStatus();
        const fipiStats = getStats();
        return sendJson(res, 200, { ai: aiStatus, fipi: fipiStats });
      }

      if (pathname === '/api/ai/generate' && req.method === 'POST') {
        const body = await parseJson(req);
        const task = await generateTask(body);
        return sendJson(res, 200, task);
      }

      if (pathname === '/api/bot') {
        if (req.method === 'GET') {
          return sendJson(res, 200, { status: 'ok', service: 'MAX Bot Webhook' });
        }
        if (req.method === 'POST') {
          const body = await parseJson(req);
          if (body.type === 'confirmation') {
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', ...getHeaders() });
            return res.end(process.env.MAX_CONFIRMATION_TOKEN || 'ok');
          }
          const text = body.text || body.object?.message?.text || body.message?.text || '';
          const payload = body.payload || body.object?.message?.payload;
          const response = handleMessage(text, payload);
          return sendJson(res, 200, response);
        }
      }

      return sendJson(res, 404, { error: 'Not found' });
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  const filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME_MAP[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500, getHeaders());
      return res.end(err.code === 'ENOENT' ? 'Not Found' : 'Server Error');
    }
    res.writeHead(200, {
      'Content-Type': mime,
      ...getHeaders()
    });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
