import express from 'express';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Product Transparency API is running' });
});

app.use('/api/products', productRoutes);
app.use('/api/reports', reportRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
