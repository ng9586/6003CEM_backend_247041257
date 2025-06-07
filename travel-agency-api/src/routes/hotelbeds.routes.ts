import { Router } from 'express';
import { getHotelbedsHotels } from '../controllers/hotelbeds.controller';

const router = Router();

router.get('/', getHotelbedsHotels);

export default router;
