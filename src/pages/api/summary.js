import { getSummary } from './chatgpt.js';
import fetch from 'node-fetch';
import { CheerioAPI } from 'cheerio';

export default async function handler(req, res) {
  try {
    const { url } = JSON.parse(req.body);
    console.log('URL:', url);

    const response = await fetch(url);
    console.log('Response:', response);

    const html = await response.text();
    

    const summary = await getSummary(html);
    console.log('Summary:', summary);
    res.status(200).json({ summary });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}
