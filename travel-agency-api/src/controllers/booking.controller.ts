import { Request, Response } from 'express';
import { Booking } from '../models/booking.model';
import { LocalHotel } from '../models/localHotel.model';
// 如果有外部酒店資料庫model，可以 import 例如 ExternalHotel
// import { ExternalHotel } from '../models/externalHotel.model';

// 建立預約
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { hotelId, hotelSource, checkInDate, stayDays } = req.body;

  if (!userId) {
    res.status(401).json({ message: '未授權' });
    return;
  }

  if (!hotelId || !hotelSource || !checkInDate || !stayDays) {
    res.status(400).json({ message: '缺少必要參數' });
    return;
  }

  try {
    let hotelName: string | undefined;

    if (hotelSource === 'local') {
      const hotel = await LocalHotel.findById(hotelId);
      if (!hotel) {
        res.status(404).json({ message: '找不到本地酒店' });
        return;
      }
      hotelName = hotel.name;
    } else if (hotelSource === 'external') {
      // TODO: 你需要根據實際情況從外部資料庫或 API 取得酒店名稱
      // 例如：
      // const hotel = await ExternalHotel.findOne({ code: hotelId });
      // if (!hotel) { ... }
      // hotelName = hotel.name;
      hotelName = '外部酒店名稱(示範)'; // 先用示範名稱，請替換
    } else {
      res.status(400).json({ message: 'hotelSource 不正確' });
      return;
    }

    const checkIn = new Date(checkInDate);
    if (isNaN(checkIn.getTime())) {
      res.status(400).json({ message: '入住日期格式錯誤' });
      return;
    }

    const days = Number(stayDays);
    if (isNaN(days) || days <= 0) {
      res.status(400).json({ message: '入住天數必須大於0' });
      return;
    }

    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + days);

    const booking = new Booking({
      user: userId,
      hotelId,
      hotelSource,
      hotelName,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      stayDays: days,
    });

    await booking.save();
    res.status(201).json({ message: '預約成功', booking });
  } catch (err) {
    console.error('[CreateBooking Error]', err);
    res.status(500).json({ message: '伺服器錯誤', error: err });
  }
};

// 查詢用戶自己預約，支援跨來源
export const getMyBookings = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: '未授權' });
    return;
  }

  try {
    const bookings = await Booking.find({ user: userId })
      .populate('user', 'username')  // 只帶 username 欄位
      .sort({ createdAt: -1 })
      .lean();

    res.json(bookings);
  } catch (err) {
    console.error('[GetMyBookings Error]', err);
    res.status(500).json({ message: '伺服器錯誤', error: err });
  }
};


// 刪除預約（只能刪除自己嘅）
export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  const bookingId = req.params.id;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: '未授權' });
    return;
  }

  try {
    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    if (!booking) {
      res.status(404).json({ message: '找不到該預約或無權刪除' });
      return;
    }

    await booking.deleteOne();
    res.status(200).json({ message: '預約已刪除' });
  } catch (err) {
    console.error('[DeleteBooking Error]', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};
