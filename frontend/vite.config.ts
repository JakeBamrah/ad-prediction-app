import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  build: {
    outDir: 'build'
  },
  server: {
    port: 3000,
  },
  plugins: [reactRefresh(), svgr()],
})
