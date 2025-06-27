import React from 'react';
import { Link } from 'react-router-dom';
import './nav.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <h3 className='title'>IMDB</h3>
      <Link to="/" className="movie">Home</Link>
      <Link to="/favorites" className="favorites">Favorites</Link>
      <Link to="/profile" className="profile">Profile</Link>
    </nav>
  );
};

export default NavBar;