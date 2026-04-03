const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { AppDataSource } = require('./src/data-source');
const authRoutes = require('./routes/auth');
const predictionRoutes = require('./routes/predictions');
const reportRoutes = require('./routes/reports');
const appointmentRoutes = require('./routes/appointments');
const healthRoutes = require('./routes/health');

dotenv.config();

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

// Initialize TypeORM and start server
AppDataSource.initialize()
  .then(() => {
    console.log('PostgreSQL connected with TypeORM');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log('TypeORM connection error:', error));