const { AppDataSource } = require('./dist/src/data-source');
const { User } = require('./dist/src/entities/User');
const { Prediction } = require('./dist/src/entities/Prediction');
const { Appointment } = require('./dist/src/entities/Appointment');
const { Report } = require('./dist/src/entities/Report');
const { HealthMetric } = require('./dist/src/entities/HealthMetric');
const { ChatbotLog } = require('./dist/src/entities/ChatbotLog');
const { Review } = require('./dist/src/entities/Review');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function clearAllUserData() {
  try {
    console.log('Connecting to database...');
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`User: ${process.env.DB_USERNAME}`);
    console.log(`Password: ${process.env.DB_PASSWORD ? '***' : 'UNDEFINED'}`);
    
    // Initialize with explicit configuration
    await AppDataSource.initialize();
    
    console.log('Database connected. Starting data cleanup...');
    
    // Get repositories
    const userRepository = AppDataSource.getRepository(User);
    const predictionRepository = AppDataSource.getRepository(Prediction);
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    const reportRepository = AppDataSource.getRepository(Report);
    const healthMetricRepository = AppDataSource.getRepository(HealthMetric);
    const chatbotLogRepository = AppDataSource.getRepository(ChatbotLog);
    const reviewRepository = AppDataSource.getRepository(Review);
    
    // Delete in order of dependencies (child tables first)
    console.log('Deleting chatbot logs...');
    await chatbotLogRepository.delete({});
    
    console.log('Deleting health metrics...');
    await healthMetricRepository.delete({});
    
    console.log('Deleting predictions...');
    await predictionRepository.delete({});
    
    console.log('Deleting appointments...');
    await appointmentRepository.delete({});
    
    console.log('Deleting reports...');
    await reportRepository.delete({});
    
    console.log('Deleting reviews...');
    await reviewRepository.delete({});
    
    console.log('Deleting users...');
    await userRepository.delete({});
    
    // Clear uploaded files
    const uploadsDir = path.join(__dirname, 'uploads');
    if (fs.existsSync(uploadsDir)) {
      console.log('Clearing uploaded files...');
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${file}`);
      }
    }
    
    // Verify deletion
    const userCount = await userRepository.count();
    const predictionCount = await predictionRepository.count();
    const appointmentCount = await appointmentRepository.count();
    const reportCount = await reportRepository.count();
    const healthMetricCount = await healthMetricRepository.count();
    const chatbotLogCount = await chatbotLogRepository.count();
    const reviewCount = await reviewRepository.count();
    
    console.log('\n=== Data Cleanup Complete ===');
    console.log(`Users remaining: ${userCount}`);
    console.log(`Predictions remaining: ${predictionCount}`);
    console.log(`Appointments remaining: ${appointmentCount}`);
    console.log(`Reports remaining: ${reportCount}`);
    console.log(`Health metrics remaining: ${healthMetricCount}`);
    console.log(`Chatbot logs remaining: ${chatbotLogCount}`);
    console.log(`Reviews remaining: ${reviewCount}`);
    
    if (userCount === 0 && predictionCount === 0 && appointmentCount === 0 && 
        reportCount === 0 && healthMetricCount === 0 && chatbotLogCount === 0 && 
        reviewCount === 0) {
      console.log('\n✅ All user data has been successfully cleared!');
    } else {
      console.log('\n⚠️  Some data may still remain. Please check the counts above.');
    }
    
  } catch (error) {
    console.error('Error clearing user data:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Run the cleanup
clearAllUserData();
