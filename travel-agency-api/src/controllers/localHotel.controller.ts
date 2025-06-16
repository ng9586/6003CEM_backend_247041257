import { Request, Response } from 'express';
import { LocalHotel } from '../models/localHotel.model';

// 取得全部 localHotel
export const getLocalHotels = async (_req: Request, res: Response): Promise<void> => {
  try {
    const hotels = await LocalHotel.find();
    res.json(hotels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '取得酒店失敗' });
  }
};

// 取得單一 localHotel 詳細
export const getLocalHotelById = async (req: Request, res: Response): Promise<void> => {
  try {
    const hotel = await LocalHotel.findById(req.params.id);
    if (!hotel) {
      res.status(404).json({ message: '找不到酒店' });
      return;
    }
    res.json(hotel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '取得酒店失敗' });
  }
};

// 新增 localHotel
export const createLocalHotel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, location, price, description } = req.body;
    const imageFilename = req.file?.filename;
    const hotel = new LocalHotel({ name, location, price, description, imageFilename });
    await hotel.save();
    res.status(201).json(hotel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '新增酒店失敗' });
  }
};

// 編輯 localHotel
export const updateLocalHotel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, location, price, description } = req.body;
    const imageFilename = req.file?.filename;
    const updateData: Partial<typeof req.body> = { name, location, price, description };
    if (imageFilename) updateData.imageFilename = imageFilename;

    const hotel = await LocalHotel.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!hotel) {
      res.status(404).json({ message: '找不到酒店' });
      return;
    }
    res.json(hotel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '更新酒店失敗' });
  }
};

// 刪除 localHotel
export const deleteLocalHotel = async (req: Request, res: Response): Promise<void> => {
  try {
    const hotel = await LocalHotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      res.status(404).json({ message: '找不到酒店' });
      return;
    }
    res.json({ message: '酒店已刪除' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '刪除酒店失敗' });
  }
};
