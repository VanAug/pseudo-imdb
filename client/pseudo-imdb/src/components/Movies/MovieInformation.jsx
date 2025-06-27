import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MovieInformation.css';
import { fetchMovieCredits, fetchMovieDetails } from '../../api/api';

const MovieInformation = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false); // Simulated favorite state

  useEffect(() => {
    const loadMovieData = async () => {
      try {
        const [movieData, creditsData] = await Promise.all([
          fetchMovieDetails(id),
          fetchMovieCredits(id),
        ]);

        setMovie(movieData);
        setCast(creditsData.cast.slice(0, 12));

        // TODO: Replace this with backend call to check if it's already a favorite
        setIsFavorite(false);
      } catch (err) {
        console.error('Error loading movie details or cast:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMovieData();
  }, [id]);

  const toggleFavorite = () => {
    if (isFavorite) {
      console.log(`Movie ${id} removed from favorites`);
      // TODO: DELETE request to backend
    } else {
      console.log(`Movie ${id} added to favorites`);
      // TODO: POST request to backend
    }
    setIsFavorite(prev => !prev);
  };

  const handleRateMovie = () => {
    console.log(`Rate movie ${id}`);
    // TODO: navigate or open modal
  };

  if (loading) return <div className="movie-info-loading">Loading...</div>;
  if (!movie) return <div className="movie-info-loading">Movie not found</div>;

  return (
    <div className="movie-info-container">
      <div className="movie-info-poster">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        ) : (
          <div className="no-image">No Image Available</div>
        )}
      </div>

      <div className="movie-info-details">
        <h1>{movie.title}</h1>
        <p><strong>Release Date:</strong> {movie.release_date}</p>
        <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
        <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
        <p className="movie-info-overview">{movie.overview}</p>
        <p><strong>Rating:</strong> {movie.vote_average.toFixed(1)} ⭐</p>

        <div className="movie-actions">
          <button
            onClick={toggleFavorite}
            className={isFavorite ? 'favorite-btn remove' : 'favorite-btn add'}
          >
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>

          {isFavorite && (
            <button onClick={handleRateMovie} className="rate-btn">
              Rate Movie
            </button>
          )}
        </div>

        <div className="movie-info-cast">
          <h2>Top Cast</h2>
          <div className="cast-list">
            {cast.map(actor => (
              <div key={actor.id} className="cast-member">
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    alt={actor.name}
                    className="cast-photo"
                  />
                ) : (
                  <div className="no-cast-image">No Photo</div>
                )}
                <div className="cast-name">{actor.name}</div>
                <div className="cast-character">as {actor.character}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInformation;
