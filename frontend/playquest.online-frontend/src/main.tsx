import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import CardTests from './views/StyleTests/CardTests.tsx'
import GuestAccount from './views/GuestAccount/index.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <CardTests /> */}
    {/* <GuestAccount /> */}
  </StrictMode>,
)
