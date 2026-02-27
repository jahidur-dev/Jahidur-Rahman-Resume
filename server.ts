import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env['PORT'] || 3000;

// Serve static files from the dist directory
const distDir = join(__dirname, 'dist/jahidur-portfolio');
app.use(express.static(distDir));

// SPA fallback: serve index.html for any other route
app.get('*', (req, res) => {
  res.sendFile(join(distDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
