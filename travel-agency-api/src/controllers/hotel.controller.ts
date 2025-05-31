import { Request, Response } from 'express';
import { Hotel } from '../models/hotel.model';

export const getHotels = async (req: Request, res: Response) => {
  const { location, minPrice, maxPrice } = req.query;

  const filter: any = {};

  if (location) filter.location = location;
  if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
  if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

  const hotels = await Hotel.find(filter);
  res.json(hotels);
};

export const createHotel = async (req: Request, res: Response) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).json(hotel);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err });
  }
};

export const updateHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const hotel = await Hotel.findByIdAndUpdate(id, req.body, { new: true });
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    res.status(400).json({ message: 'Invalid update data', error: err });
  }
};

export const deleteHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const hotel = await Hotel.findByIdAndDelete(id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json({ message: 'Hotel deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
