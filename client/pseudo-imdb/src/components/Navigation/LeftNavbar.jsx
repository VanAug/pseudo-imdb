import React, { useEffect, useState } from 'react';
import './LeftNavBar.css';
import { fetchGenres } from '../../api/api'; // We'll add this function

// Import icons (you can use react-icons or your own)
import { 
  MdLocalMovies, 
  MdWhatshot, 
  MdStar, 
  MdUpcoming,
} from 'react-icons/md';

const LeftNavBar = ({ onFilterChange }) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchGenres();
        setGenres(data);
      } catch (error) {
        console.error("Error loading genres:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Categories for sidebar
  const categories = [
    { id: 'now_playing', label: 'Now Playing', icon: <MdLocalMovies size={24} /> },
    { id: 'popular', label: 'Popular', icon: <MdWhatshot size={24} /> },
    { id: 'top_rated', label: 'Top Rated', icon: <MdStar size={24} /> },
    { id: 'upcoming', label: 'Upcoming', icon: <MdUpcoming size={24} /> },
  ];

  return (
    <aside className="left-navbar">
      <div className="navbar-header">
        <h1 className="app-logo">🎬 PseudoIMDb</h1>
        <div className="divider" />
      </div>
      
      <div className="navbar-menu">        
        {/* Categories */}
        <div className="menu-section">
          <h3 className="section-title">Categories</h3>
          <ul className="menu-list">
            {categories.map((category) => (
              <li key={category.id}>
                <button 
                  className="menu-link"
                  onClick={() => onFilterChange('category', category.id)}
                >
                  <span className="menu-icon">{category.icon}</span>
                  <span className="menu-label">{category.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="divider" />
        
        {/* Genres */}
        <div className="menu-section">
          <h3 className="section-title">Genres</h3>
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <ul className="menu-list">
              {genres.map((genre) => (
                <li key={genre.id}>
                  <button 
                    className="menu-link"
                    onClick={() => onFilterChange('genre', genre.id)}
                  >
                    <span className="menu-label">{genre.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
};

export default LeftNavBar;