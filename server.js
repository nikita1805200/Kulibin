const http = require('http');
const fs = require('fs');
const path = require('path');
const { SUBJECTS } = require('./ai/taxonomy');
const { generateTask } = require('./ai/generator');
const { checkStatus } = require('./ai/ollama');
const { getStats } = require('./ai/db');

const PORT = process.env.PORT || 3000;

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
