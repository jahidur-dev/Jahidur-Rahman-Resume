import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, 'public');
const appsDir = join(publicDir, 'apps');

let apps = [];

if (fs.existsSync(appsDir)) {
  const dirents = fs.readdirSync(appsDir, { withFileTypes: true });
  apps = dirents
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

fs.writeFileSync(join(publicDir, 'apps.json'), JSON.stringify(apps, null, 2));
console.log('Generated public/apps.json with:', apps);
