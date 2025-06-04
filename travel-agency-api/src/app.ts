import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import authRoutes from './routes/auth.routes';
import hotelRoutes from './routes/hotel.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/travel';

// ✅ CORS 設定（可按你前端網址改）
const allowedOrigins = [
  'http://localhost:5173',
  'https://didactic-goggles-g4rrx96x6xgv39vg7-5173.app.github.dev' // GitHub Codespace 前端網址
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// ✅ 連接 MongoDB
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

// ✅ 公開路由
app.use('/api/auth', authRoutes);

// ✅ 酒店 CRUD 路由（目前無權限保護）
app.use('/api/hotels', hotelRoutes);

// ✅ 根路由
app.get('/', (_req, res) => {
  res.send('🌍 Travel Agency API is running');
});

// ✅ 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
