import express from 'express';
import { getHotelDetails, searchHotels, searchHotelsWithImages } from '../controllers/hotelApi.controller';

const router = express.Router();

router.get('/hotel-details', getHotelDetails); // e.g. /api/hotels/hotel-details?hotelCode=123
router.get('/search', searchHotels); // e.g. /api/hotels/search?destinationCode=PMI&checkIn=2025-07-01&checkOut=2025-07-03&adults=2
router.get('/search-with-images', searchHotelsWithImages);
export default router;
