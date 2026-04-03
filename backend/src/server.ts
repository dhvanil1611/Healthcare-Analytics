import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import authRoutes from '../routes/auth';
import predictionRoutes from '../routes/predictions';
import reportRoutes from '../routes/reports';
import appointmentRoutes from '../routes/appointments';
import healthRoutes from '../routes/health';
import hospitalsRoutes from '../routes/hospitals';
import reviewsRoutes from '../routes/reviews';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/hospitals', hospitalsRoutes);
app.use('/api/reviews', reviewsRoutes);

// Initialize TypeORM and start server
AppDataSource.initialize()
  .then(() => {
    console.log('PostgreSQL connected with TypeORM');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log('TypeORM connection error:', error));