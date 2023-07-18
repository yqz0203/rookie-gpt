import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: 3333, host: '0.0.0.0' },
  plugins: [
    react(),
    svgr({
      svgrOptions: { svgProps: { fill: 'currentColor' } },
    }),
  ],
});
