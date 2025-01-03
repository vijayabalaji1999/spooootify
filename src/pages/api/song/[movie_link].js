import puppeteer from 'puppeteer';
import { parseSongs } from '../helper';

const url = 'https://masstamilan.dev';

async function fetchSongsByMovieLink(movieLink) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    );

    await page.goto(`${url}/${movieLink}`, { waitUntil: 'networkidle2' });

    const pageContent = await page.content();
    await browser.close();

    return parseSongs(pageContent, movieLink);
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
