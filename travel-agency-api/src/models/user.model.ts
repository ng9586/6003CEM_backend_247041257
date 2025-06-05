import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  password: string;
  role: 'user' | 'operator';
  username: string;
  avatarUrl: string;
}

const userSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'operator'], default: 'user' },
  username: { type: String, default: '' },
  avatarUrl: { type: String, default: '' }
});

export const User = mongoose.model<UserDocument>('User', userSchema);
