import axios from 'axios';

interface FlightQueryParams {
  flight_status?: string;
  dep_iata?: string;
  arr_iata?: string;
  flight_date?: string;
  limit?: number;
  offset?: number;
}

export async function getFlights(params: FlightQueryParams) {
  const access_key = process.env.AVIATIONSTACK_ACCESS_KEY;
  if (!access_key) throw new Error('Missing Aviationstack API key');

  const response = await axios.get('http://api.aviationstack.com/v1/flights', {
    params: {
      access_key,
      ...params,
    },
  });

  return response.data;
}
