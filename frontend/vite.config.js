import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'https://broker-property-management.onrender.com',
          changeOrigin: true,
        },
        '/media': {
          target: env.VITE_API_PROXY_TARGET || 'https://broker-property-management.onrender.com',
          changeOrigin: true,
        },
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild'
    }
  }
})
