import { Request, Response } from 'express';
import { Booking } from '../models/booking.model';
import { LocalHotel } from '../models/localHotel.model';

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { hotelId, checkInDate } = req.body;

  try {
    const hotel = await LocalHotel.findById(hotelId);
    if (!hotel) {
      res.status(404).json({ message: '找不到酒店' });
      return;
    }

    const booking = new Booking({
      user: userId,
      hotel: hotelId,
      checkInDate
    });

    await booking.save();
    res.status(201).json({ message: '預約成功', booking });
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err });
  }
};

export const getMyBookings = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  try {
    const bookings = await Booking.find({ user: userId }).populate('hotel');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err });
  }
};
