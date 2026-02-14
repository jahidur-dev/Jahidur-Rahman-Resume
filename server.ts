import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Namecheap/cPanel assigns a port via process.env.PORT
const port = process.env['PORT'] || 4000;

// The path to your built Angular files
// Ensure you upload your 'dist' folder to the server
const distDir = path.join(__dirname, 'dist'); 

const MIME_TYPES: Record<string, string> = {
  default: 'application/octet-stream',
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript',
  css: 'text/css',
  png: 'image/png',
  jpg: 'image/jpg',
  gif: 'image/gif',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
  json: 'application/json',
  woff: 'font/woff',
  woff2: 'font/woff2',
  ttf: 'font/ttf'
};

const server = http.createServer((req, res) => {
  const url = req.url || '/';
  // Remove query string for file lookup
  const cleanUrl = url.split('?')[0];
  
  // 1. Determine the requested file path
  let filePath = path.join(distDir, cleanUrl === '/' ? 'index.html' : cleanUrl);
  
  // 2. Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    let serveFile = filePath;
    
    // 3. SPA Fallback: If file doesn't exist (and isn't an asset request), serve index.html
    if (err) {
      // If request looks like an asset (has extension), return 404
      if (path.extname(cleanUrl).length > 0) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      // Otherwise, serve index.html for Angular routing
      serveFile = path.join(distDir, 'index.html');
    }

    // 4. Read and serve the file
    fs.readFile(serveFile, (error, content) => {
      if (error) {
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      } else {
        const ext = path.extname(serveFile).substring(1).toLowerCase();
        const contentType = MIME_TYPES[ext] || MIME_TYPES['default'];
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});