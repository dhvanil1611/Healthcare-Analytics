import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { AppDataSource } from '../src/data-source';
import { Report } from '../src/entities/Report';
import auth from '../middleware/auth';

const router = express.Router();
const uploadsDir = path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req: express.Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) =>
    cb(null, uploadsDir),
  filename: (_req: express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// Upload report
router.post('/', auth, upload.single('file'), async (req: any, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const reportRepo = AppDataSource.getRepository(Report);
    const report = reportRepo.create({
      userId: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
    await reportRepo.save(report);
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Get reports for user
router.get('/', auth, async (req: any, res) => {
  try {
    const reportRepo = AppDataSource.getRepository(Report);
    const reports = await reportRepo.find({
      where: { userId: req.user.id },
      order: { uploadDate: 'DESC' },
    });
    res.json(reports);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Download report
router.get('/:id', auth, async (req: any, res) => {
  try {
    const reportRepo = AppDataSource.getRepository(Report);
    const report = await reportRepo.findOne({ where: { id: req.params.id } });
    if (!report || report.userId !== req.user.id) return res.status(404).json({ message: 'Report not found' });

    const filePath = path.join(uploadsDir, report.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });

    res.download(filePath, report.originalName);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
