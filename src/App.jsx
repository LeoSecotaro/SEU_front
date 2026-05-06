import React from 'react'
import './index.css'
import './App.css'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import NavBar from './components/NavBar/NavBar'
import HomeHero from './components/HomeHero/HomeHero'
import CoursesList from './components/CoursesList/CoursesList'
import Footer from './components/Footer/Footer'
import CourseDetails from './pages/CourseDetails'
import Login from './pages/Login/Login'
import AdminLayout from './pages/Admin/AdminLayout'
import AdminCourses from './pages/Admin/AdminCourses'

const MainLayout = () => {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

const NavOnlyLayout = () => {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </>
  )
}

function App() {
  return (
    <div className="app-root">
      <BrowserRouter>
        <Routes>
          {/* Rutas con NavBar y Footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<><HomeHero /><CoursesList /></>} />
            <Route path="/courses/:id" element={<CourseDetails />} />
          </Route>
          
          {/* Rutas solo con NavBar */}
          <Route element={<NavOnlyLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Rutas de Administración sin NavBar ni Footer estándar */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminCourses />} />
            {/* Futuras rutas: /admin/categories, /admin/modalities, etc. */}
            <Route path="categories" element={<div>Módulo Categorías (Próximamente)</div>} />
            <Route path="modalities" element={<div>Módulo Modalidades (Próximamente)</div>} />
            <Route path="schedules" element={<div>Módulo Horarios (Próximamente)</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
