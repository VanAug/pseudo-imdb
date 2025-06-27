import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes'
import NavBar from "./components/Navigation/Navbar"

const App = () => {
  return (
    <Router>
      <NavBar />
      <AppRoutes />
    </Router>
  )
}

export default App