import express from 'express';
import { AppDataSource } from '../src/data-source';
import { Appointment } from '../src/entities/Appointment';
import auth from '../middleware/auth';

const router = express.Router();

// Get appointments for user
router.get('/', auth, async (req: any, res) => {
  try {
    const appointmentRepo = AppDataSource.getRepository(Appointment);
    const appointments = await appointmentRepo.find({
      where: { userId: req.user.id },
      order: { date: 'DESC' },
    });
    res.json(appointments);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Create appointment
router.post('/', auth, async (req: any, res) => {
  const { doctorName, specialization, date, time, notes } = req.body;
  try {
    const appointmentRepo = AppDataSource.getRepository(Appointment);
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
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Update appointment status
router.put('/:id', auth, async (req: any, res) => {
  try {
    const appointmentRepo = AppDataSource.getRepository(Appointment);
    const appointment = await appointmentRepo.findOne({ where: { id: req.params.id } });
    if (!appointment || appointment.userId !== req.user.id)
      return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = req.body.status || appointment.status;
    await appointmentRepo.save(appointment);
    res.json(appointment);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
