import axios from 'axios';
import { parseSongs } from '../helper';

const url = 'https://masstamilan.dev';

async function fetchSongsByMovieLink(movieLink) {
  try {
    const response = await axios.get(`${url}/${movieLink}`);
    if (response.status !== 200) {
      return [];
    }
    return parseSongs(response.data, movieLink);
  } catch (error) {
    console.error('Error fetching songs by movie link:', error);
    return [];
  }
}

export default async function handler(req, res) {
  const { movie_link } = req.query;

  if (!movie_link) {
    res.status(400).json({ error: 'Movie link is required' });
    return;
  }

  const songs = await fetchSongsByMovieLink(movie_link);
  res.status(200).json(songs);
  return;
}
