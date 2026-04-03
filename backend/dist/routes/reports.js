"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const data_source_1 = require("../src/data-source");
const Report_1 = require("../src/entities/Report");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
const uploadsDir = path_1.default.join(__dirname, '..', 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = (0, multer_1.default)({ storage });
router.post('/', auth_1.default, upload.single('file'), async (req, res) => {
    if (!req.file)
        return res.status(400).json({ message: 'No file uploaded' });
    try {
        const reportRepo = data_source_1.AppDataSource.getRepository(Report_1.Report);
        const report = reportRepo.create({
            userId: req.user.id,
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
        });
        await reportRepo.save(report);
        res.json(report);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/', auth_1.default, async (req, res) => {
    try {
        const reportRepo = data_source_1.AppDataSource.getRepository(Report_1.Report);
        const reports = await reportRepo.find({
            where: { userId: req.user.id },
            order: { uploadDate: 'DESC' },
        });
        res.json(reports);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/:id', auth_1.default, async (req, res) => {
    try {
        const reportRepo = data_source_1.AppDataSource.getRepository(Report_1.Report);
        const report = await reportRepo.findOne({ where: { id: req.params.id } });
        if (!report || report.userId !== req.user.id)
            return res.status(404).json({ message: 'Report not found' });
        const filePath = path_1.default.join(uploadsDir, report.filename);
        if (!fs_1.default.existsSync(filePath))
            return res.status(404).json({ message: 'File not found' });
        res.download(filePath, report.originalName);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=reports.js.map