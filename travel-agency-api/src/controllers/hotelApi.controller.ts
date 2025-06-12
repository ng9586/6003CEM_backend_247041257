import axios from 'axios';
import crypto from 'crypto';
import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.HOTELBEDS_API_KEY!;
const API_SECRET = process.env.HOTELBEDS_API_SECRET!;
const HOTELBEDS_CONTENT_API = 'https://api.test.hotelbeds.com/hotel-content-api/1.0';
const HOTELBEDS_AVAILABILITY_API = 'https://api.test.hotelbeds.com/hotel-api/1.0/hotels';

// 🔐 建立 Hotelbeds API 簽名
function getSignature(): string {
  const utc = Math.floor(Date.now() / 1000);
  return crypto.createHash('sha256').update(API_KEY + API_SECRET + utc).digest('hex');
}

// ✅ 搜尋酒店（地區 + 日期 + 人數 + 房數）
export const searchHotels = async (req: Request, res: Response): Promise<void> => {
  const {
    destinationCode = 'PMI',
    checkIn = '2025-07-01',
    checkOut = '2025-07-03',
    adults = 2,
    children = 0,
    rooms = 1,
  } = req.query;

  try {
    const numAdults = Number(adults);
    const numChildren = Number(children);
    const numRooms = Number(rooms);

    // 🔧 自動產生 paxes 資料（成人 + 小童）
    const paxes = [
      ...Array.from({ length: numAdults }, () => ({
        type: 'AD',
        age: 30,
      })),
      ...Array.from({ length: numChildren }, () => ({
        type: 'CH',
        age: 8,
      })),
    ];

    const response = await axios.post(
      HOTELBEDS_AVAILABILITY_API,
      {
        stay: {
          checkIn,
          checkOut,
        },
        occupancies: [
          {
            rooms: numRooms,
            adults: numAdults,
            children: numChildren,
            paxes,
          },
        ],
        destination: {
          code: destinationCode,
        },
      },
      {
        headers: {
          'Api-key': API_KEY,
          'X-Signature': getSignature(),
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error: any) {
    const errData = error.response?.data || error.message || 'Unknown error';
    console.error('[Hotelbeds API Error]', errData);
    res.status(500).json({ message: 'Failed to search hotels', error: errData });
  }
};

// ✅ 取得酒店詳細資料（hotelId）
export const getHotelDetails = async (req: Request, res: Response): Promise<void> => {
  const { hotelId } = req.query;

  if (!hotelId || typeof hotelId !== 'string') {
    res.status(400).json({ message: 'hotelId query parameter is required' });
    return;
  }

  try {
    const response = await axios.get(`${HOTELBEDS_CONTENT_API}/hotels/${hotelId}`, {
      headers: {
        'Api-key': API_KEY,
        'X-Signature': getSignature(),
        'Accept': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error: any) {
    const errData = error.response?.data || error.message || 'Unknown error';
    console.error('[Hotelbeds getHotelDetails Error]', errData);
    res.status(500).json({ message: 'Failed to get hotel details', error: errData });
  }
};
