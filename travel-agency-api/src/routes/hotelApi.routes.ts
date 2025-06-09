import { Router } from 'express';
import { getAttractionDetail } from '../controllers/hotelApi.controller';

const router = Router();

// 範例：GET /api/hotel-api/attraction/detail?slug=xxxx
router.get('/attraction/detail', getAttractionDetail);

export default router;
