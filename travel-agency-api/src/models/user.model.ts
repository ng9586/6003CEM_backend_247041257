import mongoose, { Schema, Document } from 'mongoose';

// 假設你有 LocalHotel 的 interface 或 model
import { LocalHotelDocument } from './localHotel.model'; // 確保路徑正確

export interface UserDocument extends Document {
  email: string;
  password: string;
  role: 'user' | 'operator';
  username: string;
  avatarUrl: string;
  // 新增收藏酒店的欄位
  favoritedHotels: mongoose.Types.ObjectId[] | LocalHotelDocument[]; // 儲存收藏酒店的 ID，或者populate後是Document
}

const userSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'operator'], default: 'user' },
  username: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  // 新增收藏酒店的欄位定義
  favoritedHotels: [
    {
      type: Schema.Types.ObjectId,
      ref: 'LocalHotel', // 參考 LocalHotel Model
    },
  ],
});

export const User = mongoose.model<UserDocument>('User', userSchema);
