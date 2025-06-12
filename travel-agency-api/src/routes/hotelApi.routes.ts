import express from 'express';
import { getHotelDetails, searchHotels } from '../controllers/hotelApi.controller';

const router = express.Router();

router.get('/hotel-details', getHotelDetails); // e.g. /api/hotel/hotel-details?hotelCode=123
router.get('/search', searchHotels); // e.g. /api/hotel/search?destinationCode=PMI&checkIn=2025-07-01&checkOut=2025-07-03&adults=2

export default router;
