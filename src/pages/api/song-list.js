import puppeteer from 'puppeteer';
import { parseMovies, parseSongs } from './helper.js';

const url = 'https://masstamilan.dev';

async function fetchSongList(pageUrl) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });
    const pageContent = await page.content();
    const pageMovies = parseMovies(pageContent);

    let songs = [];
    for (const movie of pageMovies) {
      await page.goto(`${url}/${movie.link}`, { waitUntil: 'networkidle2' });
      const movieContent = await page.content();
      const movieSongs = parseSongs(movieContent, movie.link);
      songs = [...songs, ...movieSongs.songs];
    }

    await browser.close();
    return songs;
  } catch (error) {
    console.error('Error fetching song list:', error);
    return [];
  }
}
export default async function handler(req, res) {
  const { page, random_page } = req.query;

  if (page) {
    const songs = await fetchSongList(`${url}/tamil-songs?page=${page}`);
    res.status(200).json(songs);
    return;
  }

  if (random_page) {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(`${url}/tamil-songs?page=${random_page}`, { waitUntil: 'networkidle2' });
      const pageContent = await page.content();
      const movies = parseMovies(pageContent);

      let songs = [];
      for (const movie of movies) {
        await page.goto(`${url}/${movie.link}`, { waitUntil: 'networkidle2' });
        const movieContent = await page.content();
        const movieSongs = parseSongs(movieContent, movie.link);
        songs = [...songs, ...movieSongs.songs];
        if (songs.length >= 5) break;
      }

      await browser.close();
      res.status(200).json(songs);
    } catch (error) {
      console.error('Error fetching random page content:', error);
      res.status(200).json([]);
    }
    return;
  }

  res.status(400).json({ error: 'Invalid request' });
}




