import express from 'express';
import { getHotelDetails, searchHotels, searchHotelsWithImages, getHotelPrice } from '../controllers/hotelApi.controller';

const router = express.Router();

router.get('/hotel-details', getHotelDetails); // e.g. /api/hotels/hotel-details?hotelId
router.get('/search', searchHotels); // e.g. /api/hotels/search?destinationCode=PMI&checkIn=2025-07-01&checkOut=2025-07-03&adults=2
router.get('/search-with-images', searchHotelsWithImages);
router.get('/price', getHotelPrice);
export default router;
