import mongoose, { Document, Schema } from 'mongoose';

export interface LocalHotelDocument extends Document {
  name: string;
  location: string;
  price: number;
  description?: string;
  imageFilename?: string;
}

const localHotelSchema = new Schema<LocalHotelDocument>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageFilename: { type: String },
});

export const LocalHotel = mongoose.model<LocalHotelDocument>('LocalHotel', localHotelSchema);
