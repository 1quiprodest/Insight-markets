import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "tailwindcss";
import App from './App.tsx'
import { TonConnectUIProvider } from '@tonconnect/ui-react'

// Манифест — это JSON с инфой о твоем проекте. 
// Пока можно использовать этот тестовый URL:
const manifestUrl = 'https://3b30-178-85-56-239.ngrok-free.app/tonconnect-manifest.json';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <App />
    </TonConnectUIProvider>
  </StrictMode>,
)
