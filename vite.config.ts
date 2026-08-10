import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ mode }) => {
  const plugins = [react()];

  // Optional: only in local/dev when the package is installed
  if (mode === 'development') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { componentTagger } = require('lovable-tagger');
      plugins.push(componentTagger());
    } catch {
      // package not installed - ignore
    }
  }

  return {
    server: {
      host: '::',
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            query: ['@tanstack/react-query'],
            charts: ['recharts'],
            forms: ['react-hook-form', 'zod', '@hookform/resolvers'],
          },
        },
      },
    },
  };
});
