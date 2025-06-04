import { Request, Response } from 'express';
import { Hotel } from '../models/hotel.model';

export const getHotels = async (_req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: '載入酒店失敗', error: err });
  }
};

export const createHotel = async (req: Request, res: Response) => {
  const { name, location, price, description } = req.body;

  if (!name || !location || !price) {
    return res.status(400).json({ message: '請填寫所有必要欄位' });
  }

  try {
    const hotel = new Hotel({ name, location, price, description });
    await hotel.save();
    res.status(201).json(hotel);
  } catch (err) {
    res.status(500).json({ message: '新增酒店失敗', error: err });
  }
};

export const updateHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, location, price, description } = req.body;

  try {
    const updated = await Hotel.findByIdAndUpdate(
      id,
      { name, location, price, description },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: '找不到該酒店' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: '更新酒店失敗', error: err });
  }
};

export const deleteHotel = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleted = await Hotel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: '找不到該酒店' });

    res.json({ message: '酒店已刪除' });
  } catch (err) {
    res.status(500).json({ message: '刪除酒店失敗', error: err });
  }
};
