import puppeteer from 'puppeteer';
import { detectAndTranslate, parseMovies, parseSongs } from '../helper'; // Import helper functions

const url = 'https://masstamilan.dev';

async function fetchSongsBySearchText(searchText, page) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const pageInstance = await browser.newPage();

    await pageInstance.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    );

    await pageInstance.goto(`${url}/search?keyword=${searchText}&page=${page}`, { waitUntil: 'networkidle2' });

    const searchPageContent = await pageInstance.content();
    const movies = parseMovies(searchPageContent);
    let songs = [];

    for (const movie of movies) {
      await pageInstance.goto(`${url}${movie.link}`, { waitUntil: 'networkidle2' });
      
      const moviePageContent = await pageInstance.content();
      const movieSongs = parseSongs(moviePageContent, movie.link);
      songs = [...songs, ...movieSongs.songs];

      if (songs.length >= 10) {
        break;
      }
    }

    await browser.close();
    return songs;
  } catch (error) {
    console.error('Error fetching songs by search text:', error);
    return [];
  }
}

export default async function handler(req, res) {
  const { search_text: searchText, page } = req.query;

  const translateText = await detectAndTranslate(searchText);

  if (!searchText) {
    res.status(400).json({ error: 'Search text is required' });
    return;
  }

  const songs = await fetchSongsBySearchText(translateText, page || 1);
  res.status(200).json(songs);
}
