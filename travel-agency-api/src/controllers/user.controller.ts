import { Request, Response } from 'express';
import { User } from '../models/user.model';

// ✅ 取得用戶資料
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
      role: user.role,
    });
  } catch (error) {
    console.error('[GetProfile Error]', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ 更新用戶名稱
export const updateUsername = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.body;
  if (!username) {
    res.status(400).json({ message: 'Username is required' });
    return;
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      { username },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
      role: user.role,
    });
  } catch (error) {
    console.error('[UpdateUsername Error]', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ 更新用戶頭像
export const updateAvatar = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: 'Avatar file is required' });
    return;
  }

  try {
    const avatarUrl = `/uploads/${req.file.filename}`; // ✅ 建議統一使用 avatarUrl

    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      { avatarUrl },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
      role: user.role,
    });
  } catch (error) {
    console.error('[UpdateAvatar Error]', error);
    res.status(500).json({ message: 'Server error' });
  }
};
