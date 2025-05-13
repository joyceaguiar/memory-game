import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/memory-game/', // nome do seu repositório no GitHub
  plugins: [react()],
})
