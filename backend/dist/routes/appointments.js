"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../src/data-source");
const Appointment_1 = require("../src/entities/Appointment");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.get('/', auth_1.default, async (req, res) => {
    try {
        const appointmentRepo = data_source_1.AppDataSource.getRepository(Appointment_1.Appointment);
        const appointments = await appointmentRepo.find({
            where: { userId: req.user.id },
            order: { date: 'DESC' },
        });
        res.json(appointments);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.post('/', auth_1.default, async (req, res) => {
    const { doctorName, specialization, date, time, notes } = req.body;
    try {
        const appointmentRepo = data_source_1.AppDataSource.getRepository(Appointment_1.Appointment);
        const appointment = appointmentRepo.create({
            userId: req.user.id,
            doctorName,
            specialization,
            date: new Date(date),
            time,
            notes,
        });
        await appointmentRepo.save(appointment);
        res.json(appointment);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.put('/:id', auth_1.default, async (req, res) => {
    try {
        const appointmentRepo = data_source_1.AppDataSource.getRepository(Appointment_1.Appointment);
        const appointment = await appointmentRepo.findOne({ where: { id: req.params.id } });
        if (!appointment || appointment.userId !== req.user.id)
            return res.status(404).json({ message: 'Appointment not found' });
        appointment.status = req.body.status || appointment.status;
        await appointmentRepo.save(appointment);
        res.json(appointment);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=appointments.js.map