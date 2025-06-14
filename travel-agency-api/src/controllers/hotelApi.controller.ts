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

// 圖片base URL (320px 寬標準圖)
const IMAGE_BASE_URL = 'http://photos.hotelbeds.com/giata/';

// 輔助函數：拼接完整圖片URL，若傳入空或null，回傳null
function buildImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return IMAGE_BASE_URL + path;
}

function getSignature(): string {
  const utc = Math.floor(Date.now() / 1000);
  return crypto.createHash('sha256').update(API_KEY + API_SECRET + utc).digest('hex');
}

// 酒店搜尋，返回簡化酒店資料（包含完整縮圖URL）
export const searchHotels = async (req: Request, res: Response): Promise<void> => {
  let { city = '巴塞隆拿', checkIn = '2025-07-01', checkOut = '2025-07-03', adults = '2', children = '0', rooms = '1' } = req.query;

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
    console.log('[searchHotels] Query Params:', { city, checkIn, checkOut, adults, children, rooms });

    const numAdults = Number(adults);
    const numChildren = Number(children);
    const numRooms = Number(rooms);

    const paxes = [
      ...Array.from({ length: numAdults }, () => ({ type: 'AD', age: 30 })),
      ...Array.from({ length: numChildren }, () => ({ type: 'CH', age: 8 })),
    ];

    console.log('[searchHotels] Paxes:', paxes);

    const response = await axios.post(
      HOTELBEDS_AVAILABILITY_API,
      {
        stay: { checkIn, checkOut },
        occupancies: [
          {
            rooms: numRooms,
            adults: numAdults,
            children: numChildren,
            paxes,
          },
        ],
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
    console.log('[searchHotels] Hotels count:', rawHotels.length);

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
        thumbnail: buildImageUrl(hotel.thumbnail) || null,
      };
    });

    res.json({ hotels: simplifiedHotels });
  } catch (error: any) {
    console.error('[Hotelbeds API Error]', error.response?.data || error.message || error);
    res.status(500).json({ message: 'Failed to search hotels', error: error.response?.data || error.message });
  }
};

// 根據 hotelId 取得酒店詳細資料 (包含圖片，圖片也轉成完整URL)
export const getHotelDetails = async (req: Request, res: Response): Promise<void> => {
  const { hotelId } = req.query;

  if (!hotelId || typeof hotelId !== 'string') {
    res.status(400).json({ message: 'hotelId query parameter is required' });
    return;
  }

  try {
    console.log(`[getHotelDetails] hotelId: ${hotelId}`);

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
        path: buildImageUrl(img.path),
      }));
    }

    res.json(response.data);
  } catch (error: any) {
    console.error('[Hotelbeds getHotelDetails Error]', error.response?.data || error.message || error);
    res.status(500).json({ message: 'Failed to get hotel details', error: error.response?.data || error.message });
  }
};

// 搜尋酒店同時附帶圖片 (示範前3個酒店，圖片轉成完整URL)
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
    console.log('[searchHotelsWithImages] Query Params:', { city, checkIn, checkOut, adults, children, rooms });
    console.log('Destination code:', destinationCode);

    const numAdults = Number(adults);
    const numChildren = Number(children);
    const numRooms = Number(rooms);

    const paxes = [
      ...Array.from({ length: numAdults }, () => ({ type: 'AD', age: 30 })),
      ...Array.from({ length: numChildren }, () => ({ type: 'CH', age: 8 })),
    ];

    console.log('[searchHotelsWithImages] Paxes:', paxes);

    const searchResponse = await axios.post(
      HOTELBEDS_AVAILABILITY_API,
      {
        stay: { checkIn, checkOut },
        occupancies: [
          {
            rooms: numRooms,
            adults: numAdults,
            children: numChildren,
            paxes,
          },
        ],
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
    console.log('[searchHotelsWithImages] Hotels found:', rawHotels.length);

    const hotelsWithImages = await Promise.all(
      rawHotels.slice(0, 3).map(async (hotel: any) => {
        try {
          console.log(`Fetching details for hotel code: ${hotel.code}`);

          const detailRes = await axios.get(`${HOTELBEDS_CONTENT_API}/hotels/${hotel.code}`, {
            headers: {
              'Api-key': API_KEY,
              'X-Signature': getSignature(),
              Accept: 'application/json',
            },
          });

          const images = detailRes.data.hotel?.images || [];
          const imageUrl = images.length > 0 ? buildImageUrl(images[0].path) : null;

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
        } catch (detailError) {
          console.error(`[searchHotelsWithImages] Error fetching hotel details for ${hotel.code}`, detailError);
          return {
            code: hotel.code,
            name: hotel.name,
            categoryName: hotel.categoryName,
            zoneName: hotel.zoneName,
            minPrice: null,
            imageUrl: null,
          };
        }
      })
    );

    res.json({ hotels: hotelsWithImages });
  } catch (error: any) {
    console.error('[Hotelbeds searchHotelsWithImages Error]', error.response?.data || error.message || error);
    res.status(500).json({ message: 'Failed to search hotels with images', error: error.response?.data || error.message });
  }
};
