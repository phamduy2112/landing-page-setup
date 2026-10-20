import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { createFullLandingProject } from './server/projectExporter.js'

// Ensure assets from tan-sanh-ngu-landing are copied into public/assets
const srcAssets = path.resolve('..', 'tan-sanh-ngu-landing', 'public', 'assets');
const destAssets = path.resolve('public', 'assets');
try {
  if (fs.existsSync(srcAssets)) {
    if (!fs.existsSync(destAssets)) {
      fs.mkdirSync(destAssets, { recursive: true });
    }
    fs.cpSync(srcAssets, destAssets, { recursive: true, overwrite: false });
  }
} catch (e) {
  // ignore
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'edu-landing-project-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url ? req.url.split('?')[0] : '';

          // 1. Static Assets handler
          if (url.startsWith('/assets/')) {
            const assetPath = path.resolve('..', 'tan-sanh-ngu-landing', 'public', url.slice(1));
            if (fs.existsSync(assetPath)) {
              const ext = path.extname(assetPath).toLowerCase();
              const mimeTypes = {
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.svg': 'image/svg+xml',
                '.webp': 'image/webp',
              };
              if (mimeTypes[ext]) {
                res.setHeader('Content-Type', mimeTypes[ext]);
              }
              return fs.createReadStream(assetPath).pipe(res);
            }
          }

          // 1.5. GET /api/list-projects (List available workspace landing page projects)
          if (req.method === 'GET' && url === '/api/list-projects') {
            try {
              const workspaceRoot = path.resolve('..');
              const entries = fs.readdirSync(workspaceRoot, { withFileTypes: true });
              const ignored = new Set(['builder', 'node_modules', 'docs', 'patterns', 'references', 'mockup', '.git']);
              const projects = entries
                .filter((d) => d.isDirectory() && !d.name.startsWith('.') && !ignored.has(d.name))
                .filter((d) => fs.existsSync(path.join(workspaceRoot, d.name, 'package.json')))
                .map((d) => d.name);

              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ projects }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: err.message, projects: [] }));
            }
          }

          // 2. POST /api/create-landing-project
          if (req.method === 'POST' && url === '/api/create-landing-project') {
            try {
              const body = await parseJsonBody(req);
              const result = await createFullLandingProject(body);
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify(result));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: err.message }));
            }
          }

          // 3. POST /api/open-folder
          if (req.method === 'POST' && url === '/api/open-folder') {
            try {
              const { folderPath } = await parseJsonBody(req);
              if (folderPath && fs.existsSync(folderPath)) {
                exec(`start "" "${folderPath}"`);
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: true }));
              }
              res.statusCode = 404;
              return res.end(JSON.stringify({ error: 'Folder not found' }));
            } catch (err) {
              res.statusCode = 500;
              return res.end(JSON.stringify({ error: err.message }));
            }
          }

          // 4. POST /api/run-dev
          if (req.method === 'POST' && url === '/api/run-dev') {
            try {
              const { folderPath } = await parseJsonBody(req);
              if (folderPath && fs.existsSync(folderPath)) {
                exec(`start cmd.exe /k "cd /d "${folderPath}" && npm run dev"`);
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: true, message: 'Đã mở cửa sổ terminal chạy dev server!' }));
              }
              res.statusCode = 404;
              return res.end(JSON.stringify({ error: 'Folder not found' }));
            } catch (err) {
              res.statusCode = 500;
              return res.end(JSON.stringify({ error: err.message }));
            }
          }

          // 5. POST /api/create-zip
          if (req.method === 'POST' && url === '/api/create-zip') {
            try {
              const { folderPath } = await parseJsonBody(req);
              if (!folderPath || !fs.existsSync(folderPath)) {
                res.statusCode = 404;
                return res.end(JSON.stringify({ error: 'Folder not found' }));
              }

              const zipDest = `${folderPath}.zip`;
              const escapedPath = folderPath.replace(/'/g, "''");
              const escapedZip = zipDest.replace(/'/g, "''");

              exec(`powershell -Command "Compress-Archive -Path '${escapedPath}\\*' -DestinationPath '${escapedZip}' -Force"`, (err) => {
                if (err) {
                  console.error('Zip generation error:', err);
                  res.statusCode = 500;
                  return res.end(JSON.stringify({ error: err.message }));
                }
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({
                  success: true,
                  zipPath: zipDest,
                  downloadUrl: `/api/download-zip?file=${encodeURIComponent(zipDest)}`
                }));
              });
              return;
            } catch (err) {
              res.statusCode = 500;
              return res.end(JSON.stringify({ error: err.message }));
            }
          }

          // 6. GET /api/download-zip
          if (req.method === 'GET' && url === '/api/download-zip') {
            const params = new URL(req.url, 'http://localhost').searchParams;
            const filePath = params.get('file');
            if (filePath && fs.existsSync(filePath)) {
              res.setHeader('Content-Type', 'application/zip');
              res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
              return fs.createReadStream(filePath).pipe(res);
            }
            res.statusCode = 404;
            return res.end('File not found');
          }

          next();
        });
      },
    },
  ],
})
