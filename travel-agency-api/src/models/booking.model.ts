import mongoose, { Schema, Document } from 'mongoose';

export interface BookingDocument extends Document {
  user: mongoose.Types.ObjectId;
  hotelId: string; // 本地 ObjectId 或 外部 hotelCode
  hotelSource: 'local' | 'external';
  checkInDate: Date;
  checkOutDate: Date;
  stayDays: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hotelId: { type: String, required: true },
  hotelSource: { type: String, enum: ['local', 'external'], required: true },
  hotelName: { type: String, required: true }, // 新增欄位，存酒店名稱
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  stayDays: { type: Number, required: true },
}, { timestamps: true });


export const Booking = mongoose.model<BookingDocument>('Booking', bookingSchema);
