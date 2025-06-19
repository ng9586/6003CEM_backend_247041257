import express from 'express';
import { fetchFlights } from '../controllers/flight.controller';

const router = express.Router();

router.get('/', fetchFlights);

export default router;
