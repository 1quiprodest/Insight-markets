import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // 1. Исправляет ошибку "process is not defined" (частая причина белого экрана)
  define: {
    'process.env': {},
    'global': 'window', // Добавляем на случай, если библиотеки TON ищут global
  },

  build: {
    // 2. Указываем современный стандарт кода
    target: 'esnext',
    // 3. Выключаем генерацию Source Maps для экономии места и безопасности
    sourcemap: false,
  },
})