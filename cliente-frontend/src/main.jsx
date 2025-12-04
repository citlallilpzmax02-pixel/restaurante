import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'


import 'bootstrap/dist/css/bootstrap.min.css'  // importa bootstrap aquí una sola vez
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // para que funcione el menú responsive

import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
