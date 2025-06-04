import { Request, Response } from 'express';
import { User } from '../models/user.model';

// 取得用戶資料
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error('[GetProfile Error]', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 更新用戶名稱
export const updateUsername = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: 'Name is required' });
    return;
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      { name },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('[UpdateUsername Error]', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 更新用戶頭像
export const updateAvatar = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: 'Avatar file is required' });
    return;
  }

  try {
    const avatarUrl = `/uploads/${req.file.filename}`; // 假設你有靜態資源服務uploads資料夾

    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('[UpdateAvatar Error]', error);
    res.status(500).json({ message: 'Server error' });
  }
};
