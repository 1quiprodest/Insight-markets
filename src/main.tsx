import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TonConnectUIProvider } from '@tonconnect/ui-react'

// ТЕПЕРЬ ТУТ ССЫЛКА НА VERCEL, А НЕ NGROK
const manifestUrl = 'https://insightmarkets.live/tonconnect-manifest.json';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <App />
    </TonConnectUIProvider>
  </StrictMode>,
)