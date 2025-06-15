import mongoose, { Document, Schema } from 'mongoose';

export interface HotelDocument extends Document {
  name: string;
  location: string;
  price: number;
  description?: string;
  imageFilename?: string;  // 圖片檔名
}

const hotelSchema = new Schema<HotelDocument>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageFilename: { type: String },
});

export const Hotel = mongoose.model<HotelDocument>('Hotel', hotelSchema);
