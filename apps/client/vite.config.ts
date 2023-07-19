import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';

const env = loadEnv('', '');

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: { port: 3333, host: '0.0.0.0' },
  base: env.VITE_BASE_URL,
  plugins: [
    react(),
    svgr({
      svgrOptions: { svgProps: { fill: 'currentColor' } },
    }),
  ],
}));
