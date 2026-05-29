import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      // Babel plugin: remove prop-types in prod (smaller bundle)
      babel: {
        plugins: import.meta.env?.PROD ? [['transform-react-remove-prop-types', { removeImport: true }]] : [],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    // Pre-bundle heavy deps so Vite doesn't re-process them on every cold start
    include: ['react', 'react-dom', 'lucide-react'],
    exclude: [],
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 4096,
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    // Terser would be slower; esbuild minification is fast and good enough
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Fine-grained splitting: each group cached independently
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          if (id.includes('node_modules/@sentry')) {
            return 'vendor-sentry';
          }
          // Keep monitoring/analytics in their own chunk (loaded after paint)
          if (id.includes('src/lib/monitoring') || id.includes('src/lib/analytics')) {
            return 'lib-observability';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    // Increase esbuild minification passes
    esbuildOptions: {
      legalComments: 'none',
      target: 'es2020',
    },
  },
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
});
