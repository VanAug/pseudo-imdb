import React, { useEffect, useState, useCallback } from 'react';
import './Ratings.css';
import { fetchMovieDetails } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import MovieCard from '../Movies/MovieCard';

const Ratings = () => {
  const { user } = useAuth();
  const [ratedMovies, setRatedMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editRating, setEditRating] = useState(null);
  const [editScore, setEditScore] = useState(5);
  const [editReview, setEditReview] = useState('');

  const fetchRatedMovies = useCallback(async () => {
    if (!user) return;

    try {
      const res = await fetch('http://localhost:5000/ratings/movies', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();

      const moviesWithDetails = await Promise.all(
        data.map(async (rating) => {
          const details = await fetchMovieDetails(rating.tmdb_movie_id);
          return {
            ...rating,
            title: details.title,
            poster_path: details.poster_path,
            release_date: details.release_date,
            vote_average: details.vote_average,
          };
        })
      );

      setRatedMovies(moviesWithDetails);
    } catch (err) {
      console.error('Error fetching rated movies:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchRatedMovies();
  }, [fetchRatedMovies]);

  const handleDelete = async (movie) => {
    if (!user) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete your rating for "${movie.title}"?`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/ratings/${movie.rating_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (res.ok) {
        setRatedMovies((prev) =>
          prev.filter((m) => m.rating_id !== movie.rating_id)
        );
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete rating');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleUpdate = (movie) => {
    setEditRating(movie);
    setEditScore(movie.score);
    setEditReview(movie.review);
    setShowModal(true);
  };

  const submitUpdate = async () => {
    if (!user || !editRating) return;

    try {
      const res = await fetch(`http://localhost:5000/ratings/${editRating.rating_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          score: editScore,
          review: editReview,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchRatedMovies();
      } else {
        const err = await res.json();
        alert(err.error || 'Update failed');
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  return (
  <div className="ratings-container">
    <h2>My Rated Movies</h2>

    {ratedMovies.length === 0 ? (
      <p>You haven't rated any movies yet.</p>
    ) : (
      <div className="rated-movies-grid">
        {ratedMovies.map((movie) => (
          <div key={movie.rating_id} className="rated-movie-block">
            <MovieCard movie={movie} />

            <div className="rated-movie-actions">
              <button className="update-btn" onClick={() => handleUpdate(movie)}>
                Update
              </button>
              <button className="delete-btn" onClick={() => handleDelete(movie)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}

    {showModal && (
      <div className="update-rating-modal">
        <div className="update-rating-form">
          <h3>Update Rating for "{editRating?.title}"</h3>
          <label>Score (1–10):</label>
          <input
            type="number"
            min="1"
            max="10"
            value={editScore}
            onChange={(e) => setEditScore(parseInt(e.target.value))}
          />
          <label>Review:</label>
          <textarea
            value={editReview}
            onChange={(e) => setEditReview(e.target.value)}
          />
          <div className="rating-actions">
            <button onClick={submitUpdate}>Submit</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default Ratings;
