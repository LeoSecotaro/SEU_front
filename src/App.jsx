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
import AdminLabels from './pages/Admin/AdminLabels'
import AdminModalities from './pages/Admin/AdminModalities'
import AdminSchedules from './pages/Admin/AdminSchedules'
import AdminUsers from './pages/Admin/AdminUsers'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
      <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
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
            <Route path="labels" element={<AdminLabels />} />
            <Route path="modalities" element={<AdminModalities />} />
            <Route path="schedules" element={<AdminSchedules />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
