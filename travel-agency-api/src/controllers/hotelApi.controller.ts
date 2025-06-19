import axios from 'axios';
import crypto from 'crypto';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import cityCodeMap from '../utils/cityCodeMap';

dotenv.config();

const API_KEY = process.env.HOTELBEDS_API_KEY!;
const API_SECRET = process.env.HOTELBEDS_API_SECRET!;
const HOTELBEDS_CONTENT_API = 'https://api.test.hotelbeds.com/hotel-content-api/1.0';
const HOTELBEDS_AVAILABILITY_API = 'https://api.test.hotelbeds.com/hotel-api/1.0/hotels';

// ✅ 生成 Hotelbeds API 簽名
function getSignature(): string {
  const utc = Math.floor(Date.now() / 1000);
  return crypto.createHash('sha256').update(API_KEY + API_SECRET + utc).digest('hex');
}

// ✅ 拼接圖片 URL（支援 small/bigger/original）
function buildImageUrl(path: string | null | undefined, size: 'small' | 'bigger' | 'original' = 'bigger'): string | null {
  if (!path) return null;
  return `https://photos.hotelbeds.com/giata/${size}/${path}`;
}

// 🔍 搜尋酒店（簡化資料 + 圖片）
export const searchHotels = async (req: Request, res: Response): Promise<void> => {
  let { city = '香港', checkIn = '2025-07-01', checkOut = '2025-07-03', adults = '2', children = '0', rooms = '1' } = req.query;

  if (typeof city !== 'string') {
    res.status(400).json({ message: 'city parameter must be string' });
    return;
  }

  const destinationCode = cityCodeMap[city.trim()];
  if (!destinationCode) {
    res.status(400).json({ message: `不支援城市: ${city}` });
    return;
  }

  try {
    const numAdults = Number(adults);
    const numChildren = Number(children);
    const numRooms = Number(rooms);

    const paxes = [
      ...Array.from({ length: numAdults }, () => ({ type: 'AD', age: 30 })),
      ...Array.from({ length: numChildren }, () => ({ type: 'CH', age: 8 })),
    ];

    const response = await axios.post(
      HOTELBEDS_AVAILABILITY_API,
      {
        stay: { checkIn, checkOut },
        occupancies: [{ rooms: numRooms, adults: numAdults, children: numChildren, paxes }],
        destination: { code: destinationCode },
      },
      {
        headers: {
          'Api-key': API_KEY,
          'X-Signature': getSignature(),
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const rawHotels = response.data.hotels?.hotels || [];
    const simplifiedHotels = rawHotels.map((hotel: any) => {
      const prices = hotel.rooms?.flatMap((room: any) =>
        room.rates?.map((rate: any) => parseFloat(rate.net)) || []
      ) || [];
      const minPrice = prices.length ? Math.min(...prices) : null;

      return {
        code: hotel.code,
        name: hotel.name,
        categoryName: hotel.categoryName,
        zoneName: hotel.zoneName,
        minPrice,
        thumbnail: buildImageUrl(hotel.thumbnail, 'bigger') || null,
      };
    });

    res.json({ hotels: simplifiedHotels });
  } catch (error: any) {
    console.error('[Hotelbeds API Error]', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to search hotels', error: error.response?.data || error.message });
  }
};

// 🏨 獲取酒店詳細資料（包含圖片）
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
        Accept: 'application/json',
      },
    });

    if (response.data.hotel && Array.isArray(response.data.hotel.images)) {
      response.data.hotel.images = response.data.hotel.images.map((img: any) => ({
        ...img,
        path: buildImageUrl(img.path, 'bigger'),
      }));
    }

    res.json(response.data);
  } catch (error: any) {
    console.error('[Hotelbeds getHotelDetails Error]', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to get hotel details', error: error.response?.data || error.message });
  }
};

// 🔍 搜尋酒店 + 取得前3筆完整圖片
export const searchHotelsWithImages = async (req: Request, res: Response): Promise<void> => {
  let { city = '香港', checkIn = '2025-07-01', checkOut = '2025-07-03', adults = '2', children = '0', rooms = '1' } = req.query;

  if (typeof city !== 'string') {
    res.status(400).json({ message: 'city parameter must be string' });
    return;
  }

  const destinationCode = cityCodeMap[city.trim()];
  if (!destinationCode) {
    res.status(400).json({ message: `不支援城市: ${city}` });
    return;
  }

  try {
    const numAdults = Number(adults);
    const numChildren = Number(children);
    const numRooms = Number(rooms);

    const paxes = [
      ...Array.from({ length: numAdults }, () => ({ type: 'AD', age: 30 })),
      ...Array.from({ length: numChildren }, () => ({ type: 'CH', age: 8 })),
    ];

    const searchResponse = await axios.post(
      HOTELBEDS_AVAILABILITY_API,
      {
        stay: { checkIn, checkOut },
        occupancies: [{ rooms: numRooms, adults: numAdults, children: numChildren, paxes }],
        destination: { code: destinationCode },
      },
      {
        headers: {
          'Api-key': API_KEY,
          'X-Signature': getSignature(),
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const rawHotels = searchResponse.data.hotels?.hotels || [];

    const hotelsWithImages = await Promise.all(
      rawHotels.slice(0, 5).map(async (hotel: any) => {
        try {
          const detailRes = await axios.get(`${HOTELBEDS_CONTENT_API}/hotels/${hotel.code}`, {
            headers: {
              'Api-key': API_KEY,
              'X-Signature': getSignature(),
              Accept: 'application/json',
            },
          });

          const images = detailRes.data.hotel?.images || [];
          const imageUrl = images.length > 0
            ? buildImageUrl(images[0].path, 'bigger')
            : 'https://via.placeholder.com/400x300?text=No+Image';

          const prices = hotel.rooms?.flatMap((room: any) =>
            room.rates?.map((rate: any) => parseFloat(rate.net)) || []
          ) || [];
          const minPrice = prices.length ? Math.min(...prices) : null;

          return {
            code: hotel.code,
            name: hotel.name,
            categoryName: hotel.categoryName,
            zoneName: hotel.zoneName,
            minPrice,
            imageUrl,
          };
        } catch (detailError: any) {
          console.error(`[searchHotelsWithImages] Error fetching hotel details for ${hotel.code}`, detailError.response?.data || detailError.message);
          return {
            code: hotel.code,
            name: hotel.name,
            categoryName: hotel.categoryName,
            zoneName: hotel.zoneName,
            minPrice: null,
            imageUrl: 'https://via.placeholder.com/400x300?text=No+Image',
          };
        }
      })
    );

    res.json({ hotels: hotelsWithImages });
  } catch (error: any) {
    console.error('[Hotelbeds searchHotelsWithImages Error]', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to search hotels with images', error: error.response?.data || error.message });
  }
};

// hotelApi.controller.ts
// 🏨 獲取酒店價格
export const getHotelPrice = async (req: Request, res: Response): Promise<void> => {
  const { hotelId } = req.query;

  if (!hotelId || typeof hotelId !== 'string') {
    res.status(400).json({ message: 'hotelId query parameter is required' });
    return;
  }

  try {
    // 使用正確的請求格式呼叫 Availability API 查詢該酒店的價格
    const response = await axios.post(
      HOTELBEDS_AVAILABILITY_API,
      {
        stay: { 
          checkIn: '2025-07-01', 
          checkOut: '2025-07-03' 
        },
        occupancies: [{ 
          rooms: 1, 
          adults: 2, 
          children: 0, 
          paxes: [
            { type: 'AD', age: 30 }, 
            { type: 'AD', age: 30 }
          ] 
        }],
        hotels: {
          hotel: [hotelId]  // 修正: 使用正確的格式 { hotel: [...] }
        }
      },
      {
        headers: {
          'Api-key': API_KEY,
          'X-Signature': getSignature(),
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const hotelData = response.data.hotels?.hotels?.[0];
    if (!hotelData) {
      res.status(404).json({ message: 'Hotel not found or no price data' });
      return;
    }

    const prices = hotelData.rooms?.flatMap((room: any) =>
      room.rates?.map((rate: any) => parseFloat(rate.net)) || []
    ) || [];
    const minPrice = prices.length ? Math.min(...prices) : null;

    res.json({ hotelId, minPrice });
  } catch (error: any) {
    console.error('[Hotelbeds getHotelPrice Error]', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to get hotel price', error: error.response?.data || error.message });
  }
};
