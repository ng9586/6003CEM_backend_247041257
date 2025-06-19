import { Request, Response, NextFunction } from 'express';
import { getFlights } from '../services/flightService';

export async function fetchFlights(req: Request, res: Response, next: NextFunction) {
  try {
    // 從 query 讀取可選參數
    const { flight_status, dep_iata, arr_iata, flight_date, limit, offset } = req.query;

    const params = {
      flight_status: typeof flight_status === 'string' ? flight_status : undefined,
      dep_iata: typeof dep_iata === 'string' ? dep_iata : undefined,
      arr_iata: typeof arr_iata === 'string' ? arr_iata : undefined,
      flight_date: typeof flight_date === 'string' ? flight_date : undefined,
      limit: limit ? Number(limit) : 10,
      offset: offset ? Number(offset) : 0,
    };

    const data = await getFlights(params);

    // 整理只回傳有用嘅基本資料
    const flights = data.data.map((flight: any) => ({
      flight_date: flight.flight_date,
      flight_status: flight.flight_status,
      flight_number: flight.flight.number,
      airline_name: flight.airline.name,
      departure_airport: flight.departure.airport,
      departure_iata: flight.departure.iata,
      departure_scheduled: flight.departure.scheduled,
      arrival_airport: flight.arrival.airport,
      arrival_iata: flight.arrival.iata,
      arrival_scheduled: flight.arrival.scheduled,
    }));

    res.json({ total: data.pagination.total, flights });
  } catch (error: any) {
    console.error('Fetch flights error:', error.message || error);
    res.status(500).json({ message: 'Failed to fetch flights', error: error.message || error });
  }
}
