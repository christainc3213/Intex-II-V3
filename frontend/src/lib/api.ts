const API_BASE = import.meta.env.VITE_API_BASE; 

export async function fetchMovies(page = 1) {
  const res = await fetch(`${API_BASE}/MovieTitles?page=${page}`);
  return res.json();
}