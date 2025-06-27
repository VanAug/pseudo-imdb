import React, { useState } from 'react';
import LeftNavbar from '../Navigation/LeftNavbar';
import MoviesPage from './MoviesPage';
import './MoviesGrid.css'; // Import the CSS

const Movie = () => {
  const [filter, setFilter] = useState({ 
    type: 'category', 
    value: 'now_playing' 
  });

  const handleFilterChange = (type, value) => {
    setFilter({ type, value });
  };

  return (
    <div>
      <LeftNavbar onFilterChange={handleFilterChange} />
      <MoviesPage filter={filter} />
    </div>
  );
};

export default Movie;