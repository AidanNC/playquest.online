import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import CardTests from './views/StyleTests/CardTests.tsx'
import GuestAccount from './views/GuestAccount/index.tsx'
import MainPage from './views/HostJoin/index.tsx'

import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />
  },
  {
    path: '/GuestAccount',
    element: <GuestAccount />
  },
  {
    path: '/App',
    element: <App />
  },
  {
    path: '/CardTests',
    element: <CardTests />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <RouterProvider router={router}/>
    {/* <App /> */}
    {/* <CardTests /> */}
    {/* <GuestAccount /> */}
    {/* <MainPage /> */}
  </StrictMode>,
)
