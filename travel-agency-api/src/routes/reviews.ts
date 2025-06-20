import express from 'express';
import mongoose from 'mongoose';
import Review from '../models/Review';
import { authMiddleware } from '../middlewares/auth.middleware';
import { containsBadWords } from '../utils';

const router = express.Router();

// Helper: 判斷並轉換 hotelId 格式
function parseHotelId(hotelId: string) {
  return mongoose.Types.ObjectId.isValid(hotelId) ? new mongoose.Types.ObjectId(hotelId) : hotelId;
}

// 新增留言
router.post('/', authMiddleware, async (req, res) => {
  try {
    let { hotelId, comment, rating, hotelSource } = req.body;
    const userId = req.user?.userId;

    if (!hotelId || !comment || !rating || !hotelSource) {
      res.status(400).json({ message: '缺少必要欄位' });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ message: '評分必須介乎 1 至 5' });
      return;
    }

    if (containsBadWords(comment)) {
      res.status(400).json({ message: '留言含有不當字詞' });
      return;
    }

    hotelId = parseHotelId(hotelId);

    const review = new Review({ hotelId, hotelSource, userId, comment, rating });
    await review.save();

    res.status(201).json({ message: '留言成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// 取得指定 localHotel 留言（公開）
router.get('/localHotels/:hotelId', async (req, res) => {
  try {
    const hotelId = parseHotelId(req.params.hotelId);

    const reviews = await Review.find({ hotelId, hotelSource: 'local' })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// 取得指定 externalHotel 留言（公開）
router.get('/externalHotels/:hotelId', async (req, res) => {
  try {
    const hotelId = parseHotelId(req.params.hotelId);

    const reviews = await Review.find({ hotelId, hotelSource: 'external' })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// 取得用戶自己或管理員可取得所有留言
router.get('/my-reviews', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: '未授權' });
      return;
    }

    let reviews;
    if (user.role === 'operator') {
      reviews = await Review.find()
        .populate('userId', 'username')
        .sort({ createdAt: -1 });
    } else {
      reviews = await Review.find({ userId: user.userId })
        .populate('userId', 'username')
        .sort({ createdAt: -1 });
    }

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// 刪除留言（只能刪除自己嘅留言）
router.delete('/:reviewId', authMiddleware, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: '未授權' });
      return;
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      res.status(404).json({ message: '留言不存在' });
      return;
    }

    if (review.userId.toString() !== user.userId) {
      res.status(403).json({ message: '無權限刪除他人留言' });
      return;
    }

    await Review.findByIdAndDelete(reviewId);
    res.json({ message: '刪除成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

export default router;
