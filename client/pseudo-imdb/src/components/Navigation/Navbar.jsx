import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './nav.css';
import { useAuth } from '../../context/AuthContext';

const NavBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
          <div
            className="dropdown"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <span className="nav-link username">👤 {user.username} ⏷</span>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile/:id" className="dropdown-item">My Profile</Link>
                <Link to="/favorites" className="dropdown-item">Favorites</Link>
                <Link to="/ratings" className="dropdown-item">My Ratings</Link>
                <button onClick={handleSignOut} className="dropdown-item logout-button">Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signin" className="nav-link">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
