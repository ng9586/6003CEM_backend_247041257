import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'user' | 'operator';
  favourites: mongoose.Types.ObjectId[];
  avatar?: string;
}

const userSchema: Schema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'operator'], default: 'user' },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }],
    avatar: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
