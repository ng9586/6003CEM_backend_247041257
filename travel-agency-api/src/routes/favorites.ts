import express from 'express';
import { User } from '../models/user.model';
import { LocalHotel } from '../models/localHotel.model';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// 取得用戶所有收藏的酒店列表
router.get('/me/favorites', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: '未授權' });
      return;
    }

    const foundUser = await User.findById(user.userId).populate('favoritedHotels');
    if (!foundUser) {
      res.status(404).json({ message: '用戶不存在' });
      return;
    }

    res.json(foundUser.favoritedHotels);
  } catch (error) {
    console.error('取得收藏列表失敗:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// 新增酒店到收藏
router.post('/me/favorites', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { hotelId } = req.body;

    if (!user || !hotelId) {
      res.status(400).json({ message: '缺少必要參數' });
      return;
    }

    const hotel = await LocalHotel.findById(hotelId);
    if (!hotel) {
      res.status(404).json({ message: '酒店不存在' });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { $addToSet: { favoritedHotels: hotelId } },
      { new: true }
    ).populate('favoritedHotels');

    if (!updatedUser) {
      res.status(404).json({ message: '用戶不存在' });
      return;
    }

    res.status(200).json({ message: '酒店已添加到收藏', favoritedHotels: updatedUser.favoritedHotels });
  } catch (error) {
    console.error('新增收藏失敗:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// 從收藏中移除酒店
router.delete('/me/favorites/:hotelId', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { hotelId } = req.params;

    if (!user || !hotelId) {
      res.status(400).json({ message: '缺少必要參數' });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { $pull: { favoritedHotels: hotelId } },
      { new: true }
    ).populate('favoritedHotels');

    if (!updatedUser) {
      res.status(404).json({ message: '用戶不存在' });
      return;
    }

    res.status(200).json({ message: '酒店已從收藏中移除', favoritedHotels: updatedUser.favoritedHotels });
  } catch (error) {
    console.error('移除收藏失敗:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

export default router;
