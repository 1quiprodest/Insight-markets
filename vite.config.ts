import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // 1. Разрешаем все хосты, чтобы Vite не ругался на меняющиеся ссылки ngrok
    allowedHosts: true, 
    
    // 2. Делаем сервер доступным для внешних подключений
    host: '0.0.0.0', 
    
    // 3. Разрешаем Cross-Origin запросы (CORS) — это критично для манифеста TON
    cors: true, 
    
    // 4. Фиксируем порт
    port: 5173,
    
    // 5. ДОБАВЛЯЕМ ЗАГОЛОВОК, чтобы ngrok не показывал страницу-заглушку
    // Это позволит кошелькам сразу считывать твой манифест без ошибок
    headers: {
      'ngrok-skip-browser-warning': 'true'
    },
    
    // Настройка для работы веб-сокетов (HMR) через ngrok (авто-обновление страницы)
    hmr: {
      clientPort: 443,
    },
  }
})