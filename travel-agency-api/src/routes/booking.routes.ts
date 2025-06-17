import { Router } from 'express';
import { createBooking, getMyBookings, deleteBooking } from '../controllers/booking.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createBooking);
router.get('/my', authMiddleware, getMyBookings);
router.delete('/:id', authMiddleware, deleteBooking);

export default router;
