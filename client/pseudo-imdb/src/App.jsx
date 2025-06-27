import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import NavBar from "./components/Navigation/Navbar";

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <div className="content-container">
          <AppRoutes />
        </div>
      </div>
    </Router>
  );
}

export default App;