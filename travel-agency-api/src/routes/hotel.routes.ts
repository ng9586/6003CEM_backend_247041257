import { Router } from 'express';
import {
  getHotels,
  createHotel,
  updateHotel,
  deleteHotel
} from '../controllers/hotel.controller';

const router = Router();

router.get('/', getHotels);
router.post('/', createHotel);
router.put('/:id', updateHotel);
router.delete('/:id', deleteHotel);

export default router;
