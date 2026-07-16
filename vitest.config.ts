import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    // Avoid running the same tests twice via the src/components -> shared/components symlink
    exclude: ['**/node_modules/**', '**/dist/**', 'src/components/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [
        'src/app/**',
        'src/design-system/**',
        'src/modules/**/components/**',
        'src/modules/**/pages/**',
        'src/modules/**/schemas/**',
        'src/modules/calculator/domain/**',
        'src/shared/components/**',
        'src/shared/utils/**',
        'src/services/**',
        'src/stores/**',
        'src/core/**',
      ],
      exclude: [
        'src/**/*.d.ts',
        'src/test/**',
        'src/**/*.test.{ts,tsx}',
        'src/shared/components/ui/**',
      ],
    },
  },
});
