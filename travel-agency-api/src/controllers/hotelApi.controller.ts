import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'booking-com-api5.p.rapidapi.com';

export const getAttractionDetail = async (req: Request, res: Response) => {
  const slug = req.query.slug || 'prgsnhbbbkga-borobudur-temple-climb-to-the-top-prambanan-temple-1-day-tour';

  try {
    const response = await axios.get(`https://${RAPIDAPI_HOST}/attraction/product-detail`, {
      params: {
        slug,
        limit: '1',
        page: '1',
        currency_code: 'HK',
        languagecode: 'en',
      },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY!,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('[Booking.com API Error]', error?.response?.data || error.message);
    res.status(500).json({ message: 'Booking API failed', error: error.message });
  }
};
