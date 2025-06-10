import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
const RAPIDAPI_HOST = 'booking-com-api5.p.rapidapi.com';

const axiosInstance = axios.create({
  baseURL: `https://${RAPIDAPI_HOST}`,
  headers: {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': RAPIDAPI_HOST,
  },
});

export const getSurroundingHotels = async (req: Request, res: Response): Promise<void> => {
  const { hotel_id, distance = '30', limit = '5', currency_code = 'USD', languagecode = 'en' } = req.query;

  if (!hotel_id) {
    res.status(400).json({ message: 'Missing required parameter: hotel_id' });
    return;
  }

  try {
    const response = await axiosInstance.get('/accomodation/surrounding-hotel', {
      params: {
        hotel_id,
        distance,
        limit,
        currency_code,
        languagecode,
      },
    });
    res.json(response.data);
  } catch (error: any) {
    console.error('[Booking API Error - surrounding hotels]', error?.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch surrounding hotels', error: error.message });
  }
};

export const getRoomList = async (req: Request, res: Response): Promise<void> => {
  const { hotel_id, currency_code = 'USD', languagecode = 'en' } = req.query;

  if (!hotel_id) {
    res.status(400).json({ message: 'Missing required parameter: hotel_id' });
    return;
  }

  try {
    const response = await axiosInstance.get('/accomodation/room-list', {
      params: {
        hotel_id,
        currency_code,
        languagecode,
      },
    });
    res.json(response.data);
  } catch (error: any) {
    console.error('[Booking API Error - room list]', error?.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch room list', error: error.message });
  }
};

export const autocompleteHotels = async (req: Request, res: Response): Promise<void> => {
  const { query, limit = '5', currency_code = 'USD', languagecode = 'en' } = req.query;

  if (!query || typeof query !== 'string') {
    res.status(400).json({ message: 'Missing or invalid query parameter' });
    return;
  }

  try {
    const response = await axiosInstance.get('/accomodation/autocomplete', {
      params: {
        query,
        limit,
        currency_code,
        languagecode,
      },
    });
    res.json(response.data);
  } catch (error: any) {
    console.error('[Booking API Error - autocomplete]', error?.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch autocomplete results', error: error.message });
  }
};

export const getRoomListPhoto = async (req: Request, res: Response): Promise<void> => {
  const hotel_id = Number(req.query.hotel_id);
  const arrival_date = String(req.query.arrival_date);
  const length_of_stay = Number(req.query.length_of_stay ?? 10);
  const adult_count = Number(req.query.adult_count ?? 1);
  const room_count = Number(req.query.room_count ?? 1);
  const currency_code = String(req.query.currency_code ?? 'USD');
  const languagecode = String(req.query.languagecode ?? 'en');

  if (!hotel_id || !arrival_date) {
    res.status(400).json({ message: 'Missing required parameters: hotel_id, arrival_date' });
    return;
  }

  const isValidDate = (dateStr: string) => /^\d{4}-\d{2}-\d{2}$/.test(dateStr);

  if (!isValidDate(arrival_date)) {
    res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    return;
  }

  try {
    const response = await axiosInstance.get('/accomodation/room-list-photo', {
      params: {
        hotel_id,
        arrival_date,
        length_of_stay,
        adult_count,
        room_count,
        currency_code,
        languagecode,
      },
    });
    res.json(response.data);
  } catch (error: any) {
    console.error('[Booking API Error - room list photo]', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch room photos', error: error.response?.data || error.message });
  }
};
