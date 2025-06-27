// @ts-ignore
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
// @ts-ignore
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

export async function fetchNowPlaying() {
  const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await res.json();
  return data.results;
}

export async function fetchPopular() {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await res.json();
  return data.results;
}

export async function fetchTopRated() {
  const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await res.json();
  return data.results;
}

export async function fetchGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
  const data = await res.json();
  return data.genres;
}

export async function fetchUpcoming() {
  const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await res.json();
  return data.results;
}

export async function fetchMoviesByGenre(genreId) {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US`);
  const data = await res.json();
  return data.results;
}