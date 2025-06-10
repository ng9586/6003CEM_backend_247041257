import express, { RequestHandler, Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/auth.routes';
import hotelRoutes from './routes/hotel.routes';
import userRoutes from './routes/user.routes';
import bookingRoutes from './routes/booking.routes';
import hotelApiRoutes from './routes/hotelApi.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/travel';

// 設定允許的前端 Origin (包含 Codespaces 動態網址)
const allowedOrigins = [
  'https://didactic-goggles-g4rrx96x6xgv39vg7-4173.app.github.dev',
  'https://didactic-goggles-g4rrx96x6xgv39vg7-5173.app.github.dev',
  // 如果你有其他前端網址，也放這度
];

// 自訂 CORS Middleware
const customCorsMiddleware: RequestHandler = (req, res, next) => {
  const origin = req.headers.origin as string | undefined;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // 預設不允許所有，只允許白名單 origin

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return; // 一定要 return void，避免後續呼叫 next()
  }

  next();
};

// 使用自訂 CORS Middleware
app.use(customCorsMiddleware);

// 解析 JSON Body
app.use(express.json());

// 提供 uploads 靜態資源
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/hotels', hotelApiRoutes);

// 連線 MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 路由設定
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);

// 健康檢查
app.get('/', (_req, res) => {
  res.send('🌍 Travel Agency API is running');
});

// CORS 錯誤處理 middleware（非必要，但可加強錯誤反饋）
const corsErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({ message: 'CORS Error: Origin not allowed' });
  } else {
    next(err);
  }
};
app.use(corsErrorHandler);

// 啟動 Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
