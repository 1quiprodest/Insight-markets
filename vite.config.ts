import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), nodePolyfills({globals: {
        Buffer: true, 
        global: true,
        process: true,
      },
    })],
  
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