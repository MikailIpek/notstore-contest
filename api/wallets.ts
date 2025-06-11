import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/ton-blockchain/wallets-list/main/wallets-v2.json'
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch wallets: ${res.status}`);
    }

    const data = await res.text();

    response.setHeader('Access-Control-Allow-Origin', '*'); // Telegram iframe'i için
    response.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');
    response.setHeader('Content-Type', 'application/json');
    response.status(200).send(data);
  } catch (error) {
    console.error('Wallet list fetch error:', error);

    response.status(500).json({
      error: 'Failed to fetch wallet list',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
