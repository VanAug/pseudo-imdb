import React, { useEffect, useState } from 'react';
import LeftNavbar from '../Navigation/LeftNavbar';
import MovieCard from '../Movies/MovieCard';
import { useAuth } from '../../context/AuthContext';
import { fetchMovieDetails } from '../../api/api';
import '../Movies/MoviesGrid.css';
import MoviesPage from '../Movies/MoviesPage';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [filter, setFilter] = useState({ 
    type: 'category', 
    value: 'now_playing' 
  });

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      try {
        const response = await fetch('http://localhost:5000/favorites', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }

        const favoritesData = await response.json();

        const moviesWithDetails = await Promise.all(
          favoritesData.map(async (fav) => {
            const details = await fetchMovieDetails(fav.tmdb_movie_id);
            return {
              id: fav.tmdb_movie_id,
              title: fav.title || details.title,
              poster_path: details.poster_path,
              release_date: details.release_date,
              vote_average: details.vote_average,
            };
          })
        );

        setFavorites(moviesWithDetails);
      } catch (err) {
        console.error('Error loading favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (!user) {
    return (
      <div className="main-content">
        <h1 className="page-title">Favorites</h1>
        <p>Please sign in to view your favorites</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="main-content">
        <h1 className="page-title">Favorites</h1>
        <div className="loading-spinner">Loading favorites...</div>
      </div>
    );
  }

  const handleFilterChange = (type, value) => {
    setFilter({ type, value });
  };

  return (
    <div>
      <LeftNavbar onFilterChange={handleFilterChange} />
      <div className="main-content">
        <h1 className="page-title">Your Favorites</h1>
        <div className="movies-grid">
          {favorites.length > 0 ? (
            favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          ) : (
            <p>No favorites yet. Add some movies to your favorites!</p>
          )}
        </div>
      </div>
          <MoviesPage filter={filter} />
    </div>
  );
};

export default Favorites;
