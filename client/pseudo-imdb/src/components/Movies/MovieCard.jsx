import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  // Handle missing poster
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : null;
  
  // Handle missing release date
  const releaseYear = movie.release_date 
    ? movie.release_date.substring(0, 4)
    : 'N/A';
  
  // Format rating
  const rating = movie.vote_average > 0 
    ? movie.vote_average.toFixed(1)
    : 'NR'; // Not Rated

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`}>
        <div className="poster-container">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="movie-poster"
            />
          ) : (
            <div className="no-image">No Image</div>
          )}
          <div className="rating-badge">
            <span>⭐</span> {rating}
          </div>
        </div>
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <div className="movie-year">{releaseYear}</div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;