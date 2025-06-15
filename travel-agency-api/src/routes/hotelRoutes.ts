import express from 'express';
import { Hotel } from '../models/hotel.model';
import { upload } from '../middlewares/upload'; // 你嘅 upload.ts 路徑
const router = express.Router();

// 新增酒店（含圖片）
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, location, price, description } = req.body;
    const imageFilename = req.file?.filename;

    const newHotel = new Hotel({
      name,
      location,
      price: Number(price),
      description,
      imageFilename,
    });

    await newHotel.save();
    res.status(201).json(newHotel);
  } catch (error) {
    res.status(500).json({ message: '新增酒店失敗' });
  }
});

// 取得酒店列表
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: '取得酒店列表失敗' });
  }
});

export default router;
