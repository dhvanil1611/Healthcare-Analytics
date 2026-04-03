"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../src/data-source");
const HealthMetric_1 = require("../src/entities/HealthMetric");
const ChatbotLog_1 = require("../src/entities/ChatbotLog");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.get('/metrics', auth_1.default, async (req, res) => {
    try {
        const metricRepo = data_source_1.AppDataSource.getRepository(HealthMetric_1.HealthMetric);
        const metrics = await metricRepo.find({
            where: { userId: req.user.id },
            order: { date: 'DESC' },
        });
        res.json(metrics);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.post('/metrics', auth_1.default, async (req, res) => {
    const { type, value, unit } = req.body;
    try {
        const metricRepo = data_source_1.AppDataSource.getRepository(HealthMetric_1.HealthMetric);
        const metric = metricRepo.create({
            userId: req.user.id,
            type,
            value,
            unit,
        });
        await metricRepo.save(metric);
        res.json(metric);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.post('/chatbot', auth_1.default, async (req, res) => {
    const { message, sessionId } = req.body;
    try {
        let response = "I'm sorry, I didn't understand that. Please ask about diabetes or health.";
        if (message === null || message === void 0 ? void 0 : message.toLowerCase().includes('diabetes')) {
            response = 'Diabetes is a condition that affects how your body uses blood sugar. Regular monitoring and healthy lifestyle are key.';
        }
        else if (message === null || message === void 0 ? void 0 : message.toLowerCase().includes('glucose')) {
            response = 'Fasting blood glucose should be less than 100 mg/dL for normal. Consult your doctor for personalized advice.';
        }
        else if (message === null || message === void 0 ? void 0 : message.toLowerCase().includes('diet')) {
            response = 'A balanced diet with low carbs, high fiber, and regular meals can help manage diabetes. Include vegetables, lean proteins, and whole grains.';
        }
        else if (message === null || message === void 0 ? void 0 : message.toLowerCase().includes('exercise')) {
            response = 'Regular physical activity like walking, swimming, or cycling for 30 minutes most days can improve insulin sensitivity.';
        }
        const logRepo = data_source_1.AppDataSource.getRepository(ChatbotLog_1.ChatbotLog);
        const log = logRepo.create({
            userId: req.user.id,
            sessionId,
            message,
            response,
        });
        await logRepo.save(log);
        res.json({ response });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=health.js.map