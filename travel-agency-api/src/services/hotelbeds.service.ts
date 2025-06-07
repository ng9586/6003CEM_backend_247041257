import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HOTELBEDS_API_BASE = 'https://api.test.hotelbeds.com/hotel-api/1.0';
const API_KEY = process.env.HOTELBEDS_API_KEY!;
const API_SECRET = process.env.HOTELBEDS_API_SECRET!;

const headers = {
  'Api-key': API_KEY,
  'X-Signature': '', // 需要根據當前時間生成 SHA256 簽名
  'Accept': 'application/json'
};

// ✅ 生成 X-Signature
function generateSignature(): string {
  const crypto = require('crypto');
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = crypto.createHash('sha256')
    .update(API_KEY + API_SECRET + timestamp)
    .digest('hex');
  return signature;
}

// ✅ 搜索酒店
export const fetchHotelsFromAPI = async () => {
  try {
    const signature = generateSignature();

    const response = await axios.get(`${HOTELBEDS_API_BASE}/hotels`, {
      headers: {
        ...headers,
        'X-Signature': signature,
      },
      params: {
        destination: 'PMI', // Example: Mallorca 檢測用
        checkIn: '2025-07-01',
        checkOut: '2025-07-03',
        language: 'ENG',
        rooms: '1'
      }
    });

    return response.data;
  } catch (err) {
    console.error('[Hotelbeds API Error]', err);
    throw err;
  }
};
