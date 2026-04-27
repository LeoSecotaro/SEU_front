import React from 'react'
import './index.css'
import './App.css'
import Navbar from './components/Navbar'
import HomeHero from './components/HomeHero'

function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main>
        <HomeHero />
        <section className="content container" id="cursos">
          <h2>Próximamente</h2>
          <p>Listado de cursos públicos consumidos desde la API.</p>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container">© {new Date().getFullYear()} UTN - Facultad Regional Mendoza</div>
      </footer>
    </div>
  )
}

export default App
