import { Request, Response } from 'express';
import { fetchHotelsFromAPI } from '../services/hotelbeds.service';

export const getHotelbedsHotels = async (_req: Request, res: Response) => {
  try {
    const data = await fetchHotelsFromAPI();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Hotelbeds API error' });
  }
};
