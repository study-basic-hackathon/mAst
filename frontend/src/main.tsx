import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

let root = document.getElementById('root');
if (!root) {
  root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
