import { randomUUID } from 'crypto';

const YOOKASSA_URL = 'https://api.yookassa.ru/v3/payments';
const AMOUNT = '299.00';
const CURRENCY = 'RUB';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY;

  if (!shopId || !secretKey) {
    return res.status(500).json({ error: 'Yookassa credentials not configured' });
  }

  const credentials = Buffer.from(`${shopId}:${secretKey}`).toString('base64');

  try {
    const response = await fetch(YOOKASSA_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Idempotence-Key': randomUUID(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: { value: AMOUNT, currency: CURRENCY },
        confirmation: {
          type: 'redirect',
          return_url: `${req.headers.origin || ''}/`,
        },
        description: 'RoomGenius — дизайн интерьера',
        capture: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.description || 'Yookassa error' });
    }

    res.status(200).json({ confirmationUrl: data.confirmation.confirmation_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
