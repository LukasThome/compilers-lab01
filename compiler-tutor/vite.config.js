import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-db-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const dbPath = path.resolve(__dirname, 'db.json');

          // Read DB data
          const readDb = () => {
            if (!fs.existsSync(dbPath)) {
              return { completedModules: [], currentModule: 1 };
            }
            try {
              return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
            } catch (e) {
              return { completedModules: [], currentModule: 1 };
            }
          };

          // Write DB data
          const writeDb = (data) => {
            try {
              fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
            } catch (e) {
              console.error('Failed to write to local database:', e);
            }
          };

          if (req.url === '/api/progress' && req.method === 'GET') {
            const data = readDb();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
          } else if (req.url === '/api/progress' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const payload = JSON.parse(body);
                const currentData = readDb();

                if (payload.completedModules !== undefined) {
                  currentData.completedModules = payload.completedModules;
                }
                if (payload.currentModule !== undefined) {
                  currentData.currentModule = payload.currentModule;
                }

                writeDb(currentData);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data: currentData }));
              } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  server: {
    port: 3000,
    open: true,
  },
});
