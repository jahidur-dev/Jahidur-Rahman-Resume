import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env['PORT'] || 3000;

// Increase payload limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the dist directory
const distDir = join(__dirname, 'dist/jahidur-portfolio/browser');
const publicDir = join(__dirname, 'public');

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
} else {
  console.warn(`Warning: Dist directory ${distDir} does not exist. Build the app first.`);
}

// Data Persistence Endpoints
app.get('/api/data', (req, res) => {
  const dataPath = join(publicDir, 'data.json');
  if (fs.existsSync(dataPath)) {
    res.sendFile(dataPath);
  } else {
    // Fallback to dist if public doesn't exist yet
    const distDataPath = join(distDir, 'data.json');
    if (fs.existsSync(distDataPath)) {
        res.sendFile(distDataPath);
    } else {
        res.status(404).json({ error: 'Data not found' });
    }
  }
});

app.post('/api/data', (req, res) => {
  const data = req.body;
  if (!data) {
    return res.status(400).json({ error: 'No data provided' });
  }

  try {
    const jsonString = JSON.stringify(data, null, 2);
    
    // Save to public/data.json (Persistence)
    if (!fs.existsSync(publicDir)) {
        try { fs.mkdirSync(publicDir); } catch(e) {}
    }
    fs.writeFileSync(join(publicDir, 'data.json'), jsonString);

    // Save to dist/data.json (Immediate Update)
    if (fs.existsSync(distDir)) {
        fs.writeFileSync(join(distDir, 'data.json'), jsonString);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

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
