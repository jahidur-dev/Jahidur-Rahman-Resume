import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Path to the Angular build output
// Adjust this if your build output path changes in angular.json
const distPath = join(__dirname, 'dist/jahidur-portfolio/browser');

// Check if dist folder exists
if (fs.existsSync(distPath)) {
  console.log(`Serving static files from: ${distPath}`);
  
  // Serve static files
  app.use(express.static(distPath));

  // SPA Fallback: Serve index.html for any other route
  app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
} else {
  console.warn(`WARNING: Dist folder not found at ${distPath}`);
  console.warn('Please run "npm run build" to generate the build output.');
  
  app.get('*', (req, res) => {
    res.send(`
      <h1>Angular App Not Built</h1>
      <p>The <code>dist/jahidur-portfolio/browser</code> directory was not found.</p>
      <p>Please run <code>npm run build</code> on the server or upload your local <code>dist</code> folder.</p>
    `);
  });
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
