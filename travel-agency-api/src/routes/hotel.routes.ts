import { Router } from 'express';
import {
  getHotels,
  createHotel,
  updateHotel,
  deleteHotel
} from '../controllers/hotel.controller';

import { authMiddleware } from '../middlewares/auth.middleware';
import { requireOperator } from '../middlewares/role.middleware';

const router = Router();

// Public
router.get('/', getHotels);

// Operator only
router.post('/', authMiddleware, requireOperator, createHotel);
router.put('/:id', authMiddleware, requireOperator, updateHotel);
router.delete('/:id', authMiddleware, requireOperator, deleteHotel);

export default router;
