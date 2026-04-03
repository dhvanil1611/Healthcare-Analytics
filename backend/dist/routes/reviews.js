"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../src/data-source");
const Review_1 = require("../src/entities/Review");
const Hospital_1 = require("../src/entities/Hospital");
const User_1 = require("../src/entities/User");
const router = express_1.default.Router();
const reviewRepo = data_source_1.AppDataSource.getRepository(Review_1.Review);
const hospitalRepo = data_source_1.AppDataSource.getRepository(Hospital_1.Hospital);
const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
router.get('/hospital/:hospitalId', async (req, res) => {
    try {
        const reviews = await reviewRepo.find({
            where: { hospitalId: req.params.hospitalId },
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
});
router.get('/hospital/:hospitalId/sorted', async (req, res) => {
    try {
        const sortBy = req.query.sort || 'newest';
        const reviews = await reviewRepo.find({
            where: { hospitalId: req.params.hospitalId },
            relations: ['user'],
            order: sortBy === 'highest' ? { rating: 'DESC', createdAt: 'DESC' } : { createdAt: 'DESC' }
        });
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
});
router.post('/', async (req, res) => {
    try {
        const { userId, hospitalId, rating, reviewText } = req.body;
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const hospital = await hospitalRepo.findOne({ where: { id: hospitalId } });
        if (!hospital)
            return res.status(404).json({ message: 'Hospital not found' });
        const review = reviewRepo.create({
            userId,
            hospitalId,
            rating,
            reviewText,
            user,
            hospital
        });
        await reviewRepo.save(review);
        const allReviews = await reviewRepo.find({ where: { hospitalId } });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        hospital.averageRating = parseFloat(avgRating.toFixed(1));
        hospital.totalReviews = allReviews.length;
        await hospitalRepo.save(hospital);
        res.status(201).json(review);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating review', error });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { rating, reviewText } = req.body;
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        const review = await reviewRepo.findOne({ where: { id: req.params.id } });
        if (!review)
            return res.status(404).json({ message: 'Review not found' });
        if (rating)
            review.rating = rating;
        if (reviewText)
            review.reviewText = reviewText;
        await reviewRepo.save(review);
        const allReviews = await reviewRepo.find({ where: { hospitalId: review.hospitalId } });
        const hospital = await hospitalRepo.findOne({ where: { id: review.hospitalId } });
        if (hospital) {
            const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
            hospital.averageRating = parseFloat(avgRating.toFixed(1));
            await hospitalRepo.save(hospital);
        }
        res.json(review);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating review', error });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const review = await reviewRepo.findOne({ where: { id: req.params.id } });
        if (!review)
            return res.status(404).json({ message: 'Review not found' });
        const hospitalId = review.hospitalId;
        await reviewRepo.remove(review);
        const allReviews = await reviewRepo.find({ where: { hospitalId } });
        const hospital = await hospitalRepo.findOne({ where: { id: hospitalId } });
        if (hospital) {
            if (allReviews.length > 0) {
                const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
                hospital.averageRating = parseFloat(avgRating.toFixed(1));
            }
            else {
                hospital.averageRating = 0;
            }
            hospital.totalReviews = allReviews.length;
            await hospitalRepo.save(hospital);
        }
        res.json({ message: 'Review deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting review', error });
    }
});
exports.default = router;
//# sourceMappingURL=reviews.js.map