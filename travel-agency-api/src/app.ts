import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

// 路由
import authRoutes from './routes/auth.routes';
import hotelRoutes from './routes/hotel.routes';
import userRoutes from './routes/user.routes';
import bookingRoutes from './routes/booking.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/travel';

// ✅ CORS 設定（可根據你前端網址修改）
const allowedOrigins = [
  'http://localhost:4173',
  'https://didactic-goggles-g4rrx96x6xgv39vg7-5173.app.github.dev', // GitHub Codespaces 前端網址
  'https://didactic-goggles-g4rrx96x6xgv39vg7-4173.app.github.dev',
  'http://localhost:5173',
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// ✅ 靜態檔案提供（圖片頭像）
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ✅ MongoDB connect
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Swagger 文件設定
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Travel Agency API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ API 路由
app.use('/api/auth', authRoutes);      // 註冊 / 登入
app.use('/api/hotels', hotelRoutes);   // 酒店 CRUD
app.use('/api/users', userRoutes);     // 用戶資料 / 頭像 / 名稱
app.use('/api/bookings', bookingRoutes);

// ✅ 健康檢查
app.get('/', (_req, res) => {
  res.send('🌍 Travel Agency API is running');
});

// ✅ 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
