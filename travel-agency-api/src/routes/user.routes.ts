import { Router, Request, Response } from 'express';
import { getProfile, updateUsername, updateAvatar } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload';
import { User } from '../models/user.model';

const router = Router();

router.get('/me', authMiddleware, getProfile);

router.put('/me/name', authMiddleware, updateUsername);

router.put('/me/avatar', authMiddleware, upload.single('avatar'), updateAvatar);

// 收藏相關路由

router.get('/me/favorites', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: '未授權' });
    return;
  }

  try {
    const user = await User.findById(req.user.userId).populate('favoritedHotels');
    if (!user) {
      res.status(404).json({ message: '用戶不存在' });
      return;
    }
    res.json(user.favoritedHotels);
  } catch (error) {
    console.error('取得收藏列表失敗:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

router.post('/me/favorites', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: '未授權' });
    return;
  }

  const { hotelId } = req.body;
  if (!hotelId) {
    res.status(400).json({ message: '缺少 hotelId' });
    return;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $addToSet: { favoritedHotels: hotelId } },
      { new: true }
    ).populate('favoritedHotels');

    if (!updatedUser) {
      res.status(404).json({ message: '用戶不存在' });
      return;
    }

    res.json({ message: '收藏成功', favoritedHotels: updatedUser.favoritedHotels });
  } catch (error) {
    console.error('新增收藏失敗:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

router.delete('/me/favorites/:hotelId', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: '未授權' });
    return;
  }

  const { hotelId } = req.params;
  if (!hotelId) {
    res.status(400).json({ message: '缺少 hotelId' });
    return;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { favoritedHotels: hotelId } },
      { new: true }
    ).populate('favoritedHotels');

    if (!updatedUser) {
      res.status(404).json({ message: '用戶不存在' });
      return;
    }

    res.json({ message: '取消收藏成功', favoritedHotels: updatedUser.favoritedHotels });
  } catch (error) {
    console.error('移除收藏失敗:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

export default router;
