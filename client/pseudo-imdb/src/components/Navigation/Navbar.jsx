import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './nav.css';
import { useAuth } from '../../context/AuthContext';

const NavBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/signin');
  };

  return (
    <nav className="navbar">
      <h3 className="title">PseudoIMDb</h3>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>

      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        {user ? (
          <>
            <Link to="/favorites" className="nav-link">Favorites</Link>
            <Link to="/profile" className="nav-link username">👤 {user.username}</Link>
            <button onClick={handleSignOut} className="nav-link logout-button">Sign Out</button>
          </>
        ) : (
          <Link to="/signin" className="nav-link">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
