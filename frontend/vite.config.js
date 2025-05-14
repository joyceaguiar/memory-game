import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 👇 isso garante que ele encontre seu index.html certinho
export default defineConfig({
  plugins: [react()],
  root: './', // já estamos dentro de frontend, então o root é aqui mesmo
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  base: '/memory-game/', // mesmo nome do seu repositório
})
