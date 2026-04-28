import React from 'react'
import './index.css'
import './App.css'
import NavBar from './components/NavBar/NavBar'
import HomeHero from './components/HomeHero/HomeHero'
import CoursesList from './components/CoursesList'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <div className="app-root">
      <NavBar />
      <main>
        <HomeHero />
        <CoursesList />
      </main>
      <Footer />
    </div>
  )
}

export default App
