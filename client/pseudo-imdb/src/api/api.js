// @ts-ignore
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
// @ts-ignore
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Movie Lists
export async function fetchNowPlaying(page = 1) {
  const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`);
  const data = await res.json();
  return data;
}

export async function fetchPopular(page = 1) {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
  const data = await res.json();
  return data;
}

export async function fetchTopRated(page = 1) {
  const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`);
  const data = await res.json();
  return data;
}

export async function fetchUpcoming(page = 1) {
  const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`);
  const data = await res.json();
  return data;
}

export async function fetchMoviesByGenre(genreId, page = 1) {
  const res = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US&page=${page}`
  );
  const data = await res.json();
  return data;
}

// Genres
export async function fetchGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
  const data = await res.json();
  return data.genres;
}

export async function fetchMovieDetails(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`);
  return res.json();
}

export async function fetchMovieCredits(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);
  return res.json();
}

// Search
export async function searchMovies(query) {
  const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=en-US`);
  const data = await res.json();
  return data.results;
}