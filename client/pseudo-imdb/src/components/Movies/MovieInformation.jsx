import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieInformation.css';
import { fetchMovieCredits, fetchMovieDetails } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const MovieInformation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [score, setScore] = useState(5);
  const [review, setReview] = useState('');
  const [existingRating, setExistingRating] = useState(null);

  useEffect(() => {
    const loadMovieData = async () => {
      try {
        const [movieData, creditsData] = await Promise.all([
          fetchMovieDetails(id),
          fetchMovieCredits(id),
        ]);

        setMovie(movieData);
        setCast(creditsData.cast.slice(0, 12));

        if (user) {
          const favoriteRes = await fetch(`https://fullstack-backend-hc6q.onrender.com/favorites/check/${movieData.id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          const favoriteData = await favoriteRes.json();
          setIsFavorite(favoriteData.is_favorite);

          const ratingRes = await fetch(`https://fullstack-backend-hc6q.onrender.com/ratings/check/${movieData.id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          if (ratingRes.ok) {
            const ratingData = await ratingRes.json();
            setExistingRating(ratingData);
            setScore(ratingData.score);
            setReview(ratingData.review);
          }
        }
      } catch (err) {
        console.error('Error loading movie details, cast, or rating:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMovieData();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) return navigate('/signin', { state: { from: `/movie/${id}` } });

    try {
      if (isFavorite) {
        await fetch(`https://fullstack-backend-hc6q.onrender.com/favorites/${movie.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user.token}` }
        });
      } else {
        await fetch('https://fullstack-backend-hc6q.onrender.com/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({
            tmdb_movie_id: movie.id,
            title: movie.title,
            poster_url: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null
          })
        });
      }
      setIsFavorite(prev => !prev);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleRateMovie = () => {
    if (!user) return navigate('/signin', { state: { from: `/movie/${id}` } });
    setShowRatingModal(true);
  };

  const submitRating = async () => {
    if (!user) return;

    const endpoint = existingRating
      ? `https://fullstack-backend-hc6q.onrender.com/ratings/${existingRating.id}`
      : `https://fullstack-backend-hc6q.onrender.com/ratings`;
    const method = existingRating ? 'PATCH' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          ...(method === 'POST' ? { tmdb_movie_id: movie.id } : {}),
          score,
          review
        })
      });

      if (res.ok) {
        const ratingData = await res.json();
        setExistingRating(ratingData);
        alert(existingRating ? 'Rating updated!' : 'Rating submitted!');
        setShowRatingModal(false);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to submit rating');
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
    }
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

          <button onClick={handleRateMovie} className="rate-btn">
            {existingRating ? 'Change Rating' : 'Rate Movie'}
          </button>
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

      {showRatingModal && (
        <div className="rating-modal">
          <div className="rating-form-modal">
            <h3>{existingRating ? 'Update Your Rating' : `Rate "${movie.title}"`}</h3>
            <label>Score (1–10):</label>
            <input
              type="number"
              min="1"
              max="10"
              value={score}
              onChange={(e) => setScore(parseInt(e.target.value))}
            />
            <label>Review:</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <div className="rating-actions">
              <button onClick={submitRating}>
                {existingRating ? 'Update Rating' : 'Submit Rating'}
              </button>
              <button onClick={() => setShowRatingModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieInformation;
