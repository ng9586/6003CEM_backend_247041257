import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReview extends Document {
  hotelId: Types.ObjectId | string;  // 支援外部 API 的 hotelId（string）
  userId: Types.ObjectId;
  comment: string;
  rating: number;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  hotelId: { type: Schema.Types.Mixed, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true, minlength: 1, maxlength: 1000 },
  rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true }); // 自動新增 createdAt 和 updatedAt


// Index for query optimization
reviewSchema.index({ hotelId: 1 });

const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review;
