import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import {
  fetchNowPlaying,
  fetchPopular,
  fetchTopRated,
  fetchUpcoming,
  fetchMoviesByGenre,
  fetchGenres
} from '../../api/api';
import './MoviesGrid.css';

const MoviesPage = ({ filter }) => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [pageTitle, setPageTitle] = useState('Now Playing');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load genres on mount
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data);
      } catch (error) {
        console.error("Error loading genres:", error);
      }
    };
    loadGenres();
  }, []);

  // Fetch movies when filter or currentPage changes
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let response;
        let title = '';

        if (filter.type === 'category') {
          switch (filter.value) {
            case 'now_playing':
              response = await fetchNowPlaying(currentPage);
              title = 'Now Playing';
              break;
            case 'popular':
              response = await fetchPopular(currentPage);
              title = 'Popular Movies';
              break;
            case 'top_rated':
              response = await fetchTopRated(currentPage);
              title = 'Top Rated';
              break;
            case 'upcoming':
              response = await fetchUpcoming(currentPage);
              title = 'Upcoming Movies';
              break;
            default:
              response = await fetchNowPlaying(currentPage);
              title = 'Now Playing';
          }
        } else if (filter.type === 'genre') {
          response = await fetchMoviesByGenre(filter.value, currentPage);
          const genreName = genres.find(g => g.id === filter.value)?.name;
          title = genreName ? `${genreName} Movies` : 'Genre Movies';
        }

        if (response && Array.isArray(response.results)) {
          setMovies(response.results);
          setTotalPages(response.total_pages || 1);
        } else {
          setMovies([]);
          setTotalPages(1);
        }

        setPageTitle(title);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [filter, genres, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">{pageTitle}</h1>

      {loading ? (
        <div className="loading-spinner">Loading movies...</div>
      ) : (
        <>
          <div className="movies-grid">
            {Array.isArray(movies) && movies.length > 0 ? (
              movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))
            ) : (
              <p>No movies found.</p>
            )}
          </div>

          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ◀ Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MoviesPage;
