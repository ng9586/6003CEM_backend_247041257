import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReview extends Document {
  hotelId: Types.ObjectId | string;  // 支援外部 API 的 hotelId（string）
  hotelSource: 'local' | 'external'; // ✅ 新增
  userId: Types.ObjectId;
  comment: string;
  rating: number;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    hotelId: { type: Schema.Types.Mixed, required: true },
    hotelSource: {
      type: String,
      enum: ['local', 'external'],
      required: true,
    }, // ✅ 新增欄位
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true, minlength: 1, maxlength: 1000 },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true } // 自動加入 createdAt 和 updatedAt
);

// 建索引
reviewSchema.index({ hotelId: 1, hotelSource: 1 }); // ✅ 建議 index 包含 hotelSource

const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
