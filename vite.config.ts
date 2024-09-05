import { defineConfig, loadEnv  } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    resolve: {
      alias: [{ find: '~', replacement: path.resolve(__dirname, 'src') }],
    },
    server: {
      port: Number(env.PORT) || 3001,
      open: true
    },
    define: {
      'process.env': env,
    },
    build: {
      chunkSizeWarningLimit: 2000, // Kích thước tối đa cho mỗi file chunk (kB)
    },
  }
})