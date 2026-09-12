import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  if (pathname.startsWith('/api/ai/')) {
    try {
      if (pathname === '/api/ai/status' && req.method === 'GET') {
        try {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 2000);
          const check = await fetch(`${OLLAMA_HOST}/api/tags`, { signal: ctrl.signal });
          clearTimeout(timer);

          if (check.ok) {
            const data = await check.json();
            return sendJson(res, 200, {
              status: 'online',
              host: OLLAMA_HOST,
              default_model: DEFAULT_MODEL,
              models: data.models?.map(m => m.name) || []
            });
          }
        } catch {}

        return sendJson(res, 200, {
          status: 'offline',
          host: OLLAMA_HOST,
          default_model: DEFAULT_MODEL,
          models: []
        });
      }

      if (pathname === '/api/ai/chat' && req.method === 'POST') {
        const body = await parseJson(req);
        const model = body.model || DEFAULT_MODEL;

        const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: model,
            messages: body.messages || [],
            stream: false,
            options: { temperature: body.temperature ?? 0.7 }
          })
        });

        if (!response.ok) {
          const err = await response.text();
          return sendJson(res, response.status, { error: err });
        }

        const data = await response.json();
        return sendJson(res, 200, {
          message: data.message?.content || '',
          model: data.model
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
