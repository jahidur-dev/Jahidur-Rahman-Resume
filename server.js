
const http = require('http');
const fs = require('fs');
const path = require('path');

// Namecheap/cPanel assigns a port via process.env.PORT
const port = process.env.PORT || 4000;

// Base directory for build files
const distBase = path.join(__dirname, 'dist');

// Helper to recursively find the directory containing index.html inside dist
function findBuildDirectory(currentPath) {
  if (!fs.existsSync(currentPath)) return null;
  
  // Check if index.html is here
  if (fs.existsSync(path.join(currentPath, 'index.html'))) {
    return currentPath;
  }
  
  // Search subdirectories (e.g. dist/browser or dist/app-name/browser)
  try {
    const items = fs.readdirSync(currentPath);
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      if (fs.statSync(fullPath).isDirectory()) {
        const found = findBuildDirectory(fullPath);
        if (found) return found;
      }
    }
  } catch (e) {
    return null;
  }
  return null;
}

// Attempt to locate the build folder
const distDir = findBuildDirectory(distBase);

const MIME_TYPES = {
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
  // If no dist folder found, serve a Debug/Maintenance page
  if (!distDir) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1>Node.js Server is Running!</h1>
          <p style="color: orange; font-weight: bold;">Status: Waiting for Angular Build</p>
          <p>The server cannot find the <code>index.html</code> file.</p>
          <p><strong>Action Required:</strong> Please upload your local <code>dist</code> folder to <code>${distBase}</code> on the server.</p>
          <hr>
          <p style="font-size: 0.8em; color: #666;">Node Version: ${process.version}</p>
        </body>
      </html>
    `);
    return;
  }

  const url = req.url || '/';
  const cleanUrl = url.split('?')[0];
  
  // 1. Determine the requested file path
  let filePath = path.join(distDir, cleanUrl === '/' ? 'index.html' : cleanUrl);
  
  // 2. Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    let serveFile = filePath;
    let isAsset = path.extname(cleanUrl).length > 0;

    // 3. SPA Fallback: If file doesn't exist...
    if (err) {
      // If it looks like an asset (has extension like .js, .png), return 404
      if (isAsset) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      // Otherwise (route like /about), serve index.html for Angular routing
      serveFile = path.join(distDir, 'index.html');
    }

    // 4. Read and serve the file
    fs.readFile(serveFile, (error, content) => {
      if (error) {
        res.writeHead(500);
        res.end('Server Error: ' + (error.code || error.message));
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
  if (distDir) {
    console.log(`SUCCESS: Serving Angular app from: ${distDir}`);
  } else {
    console.log(`WARNING: No dist folder found at ${distBase}. Serving maintenance page.`);
  }
});
