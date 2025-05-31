import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { generateToken } from '../utils/jwt';

const SIGN_UP_CODE = process.env.SIGN_UP_CODE || 'agency2025';

export const register = async (req: Request, res: Response) => {
  const { email, password, signUpCode } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = signUpCode === SIGN_UP_CODE ? 'operator' : 'user';

    const user = new User({ email, password: hashedPassword, role });
    await user.save();

    const token = generateToken({ userId: user._id, role: user.role });
    res.status(201).json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken({ userId: user._id, role: user.role });
    res.status(200).json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
