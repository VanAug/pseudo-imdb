import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import { 
  fetchNowPlaying, 
  fetchPopular, 
  fetchTopRated,
  fetchUpcoming,
  fetchMoviesByGenre
} from '../../api/api';
import './MoviesGrid.css';

const MoviesPage = ({ filter }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState('Now Playing');
  
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let data = [];
        let title = '';
        
        if (filter.type === 'category') {
          switch(filter.value) {
            case 'now_playing':
              data = await fetchNowPlaying();
              title = 'Now Playing';
              break;
            case 'popular':
              data = await fetchPopular();
              title = 'Popular Movies';
              break;
            case 'top_rated':
              data = await fetchTopRated();
              title = 'Top Rated';
              break;
            case 'upcoming':
              data = await fetchUpcoming();
              title = 'Upcoming Movies';
              break;
            default:
              data = await fetchNowPlaying();
              title = 'Now Playing';
          }
        } 
        else if (filter.type === 'genre') {
          data = await fetchMoviesByGenre(filter.value);
          title = 'Genre Movies';
        }
        
        setMovies(data);
        setPageTitle(title);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, [filter]);

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-spinner">Loading movies...</div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h1 className="page-title">{pageTitle}</h1>
      <div className="movies-grid">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;