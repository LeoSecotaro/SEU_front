import React from 'react'
import './index.css'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar/NavBar'
import HomeHero from './components/HomeHero/HomeHero'
import CoursesList from './components/CoursesList'
import Footer from './components/Footer/Footer'
import CourseDetails from './pages/CourseDetails'

function App() {
  return (
    <div className="app-root">
      <BrowserRouter>
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<><HomeHero /><CoursesList /></>} />
            <Route path="/courses/:id" element={<CourseDetails />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
