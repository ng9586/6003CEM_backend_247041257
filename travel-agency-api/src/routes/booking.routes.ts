import { Router } from 'express';
import { createBooking, getMyBookings } from '../controllers/booking.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createBooking);
router.get('/my', authMiddleware, getMyBookings);

export default router;
