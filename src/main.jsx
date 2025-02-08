import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import QuoteCalculator from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QuoteCalculator />
  </StrictMode>,
)
