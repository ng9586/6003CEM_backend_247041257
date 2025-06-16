import express from 'express';
import { upload } from '../middlewares/upload';  // 你已有嘅 multer 設定
import {
  getLocalHotels,
  getLocalHotelById,
  createLocalHotel,
  updateLocalHotel,
  deleteLocalHotel,
} from '../controllers/localHotel.controller';

const router = express.Router();

router.get('/', getLocalHotels);
router.get('/:id', getLocalHotelById);
router.post('/', upload.single('image'), createLocalHotel);
router.put('/:id', upload.single('image'), updateLocalHotel);
router.delete('/:id', deleteLocalHotel);

export default router;
