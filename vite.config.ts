import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dev API plugin to handle /api/ai/* directly within Vite dev server
function apiDevPlugin(): Plugin {
  return {
    name: 'api-dev-routes',
    configureServer(server) {
      server.middlewares.use('/api/ai/chat', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const message = (data.message || '').toLowerCase();
              const language = data.language || 'en';

              let reply = '';
              if (language === 'hi') {
                reply = 'नमस्ते! मैं गॉवफ्लो सहायक हूँ। आय प्रमाण पत्र या छात्रवृत्ति नियमों के लिए आवश्यक दस्तावेज़ों की जानकारी यहाँ उपलब्ध है।';
              } else if (language === 'gu') {
                reply = 'નમસ્તે! હું ગવફ્લો સહાયક છું. આવકના દાખલા અને સરકારી પ્રમાણપત્રો માટે જરૂરી પુરાવાઓની માહિતી અહીં ઉપલબ્ધ છે.';
              } else {
                reply = 'Hello! I am your GovFlow Citizen Assistant. For an Income Certificate, required documents include Identity Proof, Address Proof (electricity bill), and Salary Slip or Talati income report.';
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ reply, source: 'heuristic' }));
            } catch (e) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
