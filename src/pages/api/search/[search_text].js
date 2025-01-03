import puppeteer from 'puppeteer';
import { detectAndTranslate, parseMovies, parseSongs } from '../helper'; // Import helper functions

const url = 'https://masstamilan.dev';

async function fetchMoviesBySearchText(searchText) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    );

    await page.goto(`${url}/search?keyword=${searchText}`, { waitUntil: 'networkidle2' });

    const pageContent = await page.content();
    const movies = parseMovies(pageContent);

    await browser.close();
    return movies;
  } catch (error) {
    console.error('Error fetching movies by search text:', error);
    return [];
  }
}

export default async function handler(req, res) {
  const { search_text: searchText } = req.query;

  const translateText = await detectAndTranslate(searchText);

  if (!searchText) {
    res.status(400).json({ error: 'Search text is required' });
    return;
  }
  const movies = await fetchMoviesBySearchText(translateText);
  res.status(200).json(movies);
  return;
}
