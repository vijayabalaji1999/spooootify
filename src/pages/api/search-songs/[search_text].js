import axios from 'axios';
import { parseMovies, parseSongs } from '../helper'; // Import helper functions

const url = 'https://masstamilan.dev';

async function fetchSongsBySearchText(searchText, page) {
  try {
    const response = await axios.get(
      `${url}/search?keyword=${searchText}&page=${page}`
    );
    if (response.status !== 200) {
      return [];
    }

    const movies = parseMovies(response.data);
    let songs = [];

    for (const movie of movies) {
      const movieResponse = await axios.get(`${url}${movie.link}`);
      if (movieResponse.status !== 200) {
        continue;
      }

      const movieSongs = parseSongs(movieResponse.data, movie.link);
      songs = [...songs, ...movieSongs.songs];

      if (songs.length >= 10) {
        break;
      }
    }

    return songs;
  } catch (error) {
    console.error('Error fetching songs by search text:', error);
    return [];
  }
}

export default async function handler(req, res) {
  const { search_text: searchText, page } = req.query;

  if (!searchText) {
    res.status(400).json({ error: 'Search text is required' });
    return;
  }

  const songs = await fetchSongsBySearchText(searchText, page || 1);
  res.status(200).json(songs);
}
