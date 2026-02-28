import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env['PORT'] || 3000;

// Increase payload limit for file uploads
app.use(express.json({ limit: '10mb' }));

// Serve static files from the dist directory
const distDir = join(__dirname, 'dist/jahidur-portfolio/browser');
const publicDir = join(__dirname, 'public');

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
} else {
  console.warn(`Warning: Dist directory ${distDir} does not exist. Build the app first.`);
}

// Resume Upload Endpoint
app.post('/api/upload-resume', (req, res) => {
  const { fileData } = req.body; // Expecting base64 string
  if (!fileData) {
    return res.status(400).json({ error: 'No file data provided' });
  }

  const base64Data = fileData.replace(/^data:application\/pdf;base64,/, "");
  const buffer = Buffer.from(base64Data, 'base64');

  try {
    // Save to dist for immediate availability
    if (fs.existsSync(distDir)) {
        fs.writeFileSync(join(distDir, 'resume.pdf'), buffer);
    }
    
    // Also try to save to public/ if it exists, for dev persistence
    if (!fs.existsSync(publicDir)) {
            try { fs.mkdirSync(publicDir); } catch(e) {}
    }
    if (fs.existsSync(publicDir)) {
            fs.writeFileSync(join(publicDir, 'resume.pdf'), buffer);
    }

    res.json({ success: true, message: 'Resume uploaded successfully' });
  } catch (err) {
    console.error('Error saving resume:', err);
    res.status(500).json({ error: 'Failed to save resume' });
  }
});

// SPA fallback: serve index.html for any other route
app.get(/.*/, (req, res) => {
  const indexPath = join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application not built. Please run npm run build.');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
