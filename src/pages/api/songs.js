import puppeteer from 'puppeteer';
import { parseMovies } from './helper.js';

const url = 'https://masstamilan.dev';

async function fetchPageContent(pageUrl) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setUserAgent(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
        );

        await page.goto(pageUrl, {
            waitUntil: 'networkidle2'
        });

        const pageContent = await page.content();
        await browser.close();

        return parseMovies(pageContent);
    } catch (error) {
        console.error('Error fetching page content:', error);
        return [];
    }
}


export default async function handler(req, res) {
  const { action, page } = req.query;

  if (!page) {
    res.status(400).json({ error: 'Page parameter is required' });
    return;
  }

  const actionPage = parseInt(page, 10);
  const actionUrl =
    action === 'next' || action === 'prev'
      ? `${url}/tamil-songs?page=${actionPage}`
      : `${url}/tamil-songs?page=${page}`;

  const movies = await fetchPageContent(actionUrl);
  res.status(200).json(movies);
}
