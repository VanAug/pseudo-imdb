import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMovies } from '../../api/api';
import MovieCard from '../Movies/MovieCard';
import './Search.css';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Search = () => {
  const query = useQuery().get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const movies = await searchMovies(query);
        setResults(movies);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="search-container">
      <h2>Search Results for: <span>"{query}"</span></h2>

      {loading ? (
        <p className="search-loading">Loading...</p>
      ) : results.length === 0 ? (
        <p className="search-no-results">No results found.</p>
      ) : (
        <div className="search-results">
          {results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
