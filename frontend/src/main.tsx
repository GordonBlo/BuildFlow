import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

const isDemoBuild = import.meta.env.MODE === 'demo'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isDemoBuild ? (
      <HashRouter>
        <App />
      </HashRouter>
    ) : (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )}
  </StrictMode>,
)
