import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    checkInDate: { type: Date, required: true }
  },
  { timestamps: true }
);

export const Booking = mongoose.model('Booking', bookingSchema);
