import express from 'express';
import { AppDataSource } from '../src/data-source';
import { HealthMetric } from '../src/entities/HealthMetric';
import { ChatbotLog } from '../src/entities/ChatbotLog';
import auth from '../middleware/auth';

const router = express.Router();

// Get health metrics for user
router.get('/metrics', auth, async (req: any, res) => {
  try {
    const metricRepo = AppDataSource.getRepository(HealthMetric);
    const metrics = await metricRepo.find({
      where: { userId: req.user.id },
      order: { date: 'DESC' },
    });
    res.json(metrics);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Add health metric
router.post('/metrics', auth, async (req: any, res) => {
  const { type, value, unit } = req.body;
  try {
    const metricRepo = AppDataSource.getRepository(HealthMetric);
    const metric = metricRepo.create({
      userId: req.user.id,
      type,
      value,
      unit,
    });
    await metricRepo.save(metric);
    res.json(metric);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Chatbot endpoint
router.post('/chatbot', auth, async (req: any, res) => {
  const { message, sessionId } = req.body;
  try {
    let response = "I'm sorry, I didn't understand that. Please ask about diabetes or health.";

    if (message?.toLowerCase().includes('diabetes')) {
      response = 'Diabetes is a condition that affects how your body uses blood sugar. Regular monitoring and healthy lifestyle are key.';
    } else if (message?.toLowerCase().includes('glucose')) {
      response = 'Fasting blood glucose should be less than 100 mg/dL for normal. Consult your doctor for personalized advice.';
    } else if (message?.toLowerCase().includes('diet')) {
      response = 'A balanced diet with low carbs, high fiber, and regular meals can help manage diabetes. Include vegetables, lean proteins, and whole grains.';
    } else if (message?.toLowerCase().includes('exercise')) {
      response = 'Regular physical activity like walking, swimming, or cycling for 30 minutes most days can improve insulin sensitivity.';
    }

    const logRepo = AppDataSource.getRepository(ChatbotLog);
    const log = logRepo.create({
      userId: req.user.id,
      sessionId,
      message,
      response,
    });
    await logRepo.save(log);

    res.json({ response });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
