import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { generateToken } from '../utils/jwt';

const SIGN_UP_CODE = process.env.SIGN_UP_CODE || 'agency2025';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, signUpCode } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email 和密碼為必填項' });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email 已經被註冊' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = signUpCode === SIGN_UP_CODE ? 'operator' : 'user';

    const user = new User({ email, password: hashedPassword, role });
    await user.save();

    const token = generateToken({ userId: user._id, role: user.role });
    res.status(201).json({ token, role: user.role });
  } catch (err) {
    console.error('[Register Error]', err);
    res.status(500).json({ message: '伺服器錯誤', error: err });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: '請輸入 Email 和密碼' });
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: '帳號或密碼錯誤' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: '帳號或密碼錯誤' });
      return;
    }

    const token = generateToken({ userId: user._id, role: user.role });
    res.status(200).json({ token, role: user.role });
  } catch (err) {
    console.error('[Login Error]', err);
    res.status(500).json({ message: '伺服器錯誤', error: err });
  }
};
