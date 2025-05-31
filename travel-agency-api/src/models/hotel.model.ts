import mongoose, { Document, Schema } from 'mongoose';

export interface IHotel extends Document {
  name: string;
  location: string;
  price: number;
  description: string;
  available: boolean;
  image?: string;
}

const hotelSchema: Schema = new Schema<IHotel>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    available: { type: Boolean, default: true },
    image: { type: String },
  },
  { timestamps: true }
);

export const Hotel = mongoose.model<IHotel>('Hotel', hotelSchema);
