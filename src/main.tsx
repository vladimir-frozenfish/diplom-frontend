import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import { basePath } from './enum/enum.ts'
import App from './App.tsx'
import Admin from './components/admin/Admin.tsx'
import ErrorPage404 from './components/errorPages/ErrorPage404.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <Routes>
        <Route path={basePath} element={<App />}/>
        <Route path={`${basePath}/admin`} element={<Admin />}/>
        <Route path='*' element={<ErrorPage404 />}/>
      </Routes>
    </StrictMode>
  </BrowserRouter>,
)
