import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/travel';

app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Swagger setup
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

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('API is running');
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
