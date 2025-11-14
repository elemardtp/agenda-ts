// Nome do arquivo: ./frontend/vite.config.ts
// Finalidade: Configuração do Vite para o frontend.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths()
  ],
  resolve: {
    alias: {
      '@govbr-ds': path.resolve(__dirname, 'node_modules/@govbr-ds'),
      '@services': path.resolve(__dirname, './src/services')
    }
  },
  build: {
    sourcemap: false,
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  publicDir: 'public',
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: true
  },
  base: '/',
  mode: process.env.NODE_ENV || 'development',
  envDir: '.'
})
