const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.PORT, 10) || 8080;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.mjs': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.otf': 'font/otf',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.frag': 'text/plain',
  '.bin': 'application/octet-stream',
  '.map': 'application/json'
};

const server = http.createServer((req, res) => {
  // CORS & Security headers compatible with Google Sign-in and WebAssembly
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);
  if (pathname === '/') pathname = '/index.html';

  let filePath = path.join(PUBLIC_DIR, pathname);
  const ext = path.extname(pathname).toLowerCase();

  fs.stat(filePath, (err, stats) => {
    // If the file does not exist:
    if (err || !stats.isFile()) {
      // If it's a static file request (has a known extension other than .html), return 404
      if (ext && ext !== '.html') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end(`404 Not Found: ${pathname}`);
        return;
      }

      // Otherwise, it's a SPA navigation route -> fallback to index.html
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const resolvedExt = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[resolvedExt] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('Server Error: ' + readErr.message);
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠️  Port ${PORT} is already in use by another process.`);
    console.error(`   Please terminate the existing process or run with: set PORT=8081 && node server.js\n`);
  } else {
    console.error('\n⚠️  Server encountered an error:', err.message);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🌿 Plantora Web App is running at: http://localhost:${PORT}`);
  console.log(`Landing page available at: http://localhost:${PORT}/landing.html`);
  console.log(`==================================================\n`);
});
