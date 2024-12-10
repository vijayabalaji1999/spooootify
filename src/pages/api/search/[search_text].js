import axios from 'axios';
import { parseMovies, parseSongs } from '../helper'; // Import helper functions

const url = 'https://masstamilan.dev';

async function fetchMoviesBySearchText(searchText) {
  try {
    const response = await axios.get(`${url}/search?keyword=${searchText}`);
    if (response.status !== 200) {
      return [];
    }
    return parseMovies(response.data);
  } catch (error) {
    console.error('Error fetching movies by search text:', error);
    return [];
  }
}

export default async function handler(req, res) {
  const { search_text: searchText } = req.query;

  if (!searchText) {
    res.status(400).json({ error: 'Search text is required' });
    return;
  }
  const movies = await fetchMoviesBySearchText(searchText);
  res.status(200).json(movies);
  return;
}
