"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../src/data-source");
const Hospital_1 = require("../src/entities/Hospital");
const Review_1 = require("../src/entities/Review");
const router = express_1.default.Router();
const hospitalRepo = data_source_1.AppDataSource.getRepository(Hospital_1.Hospital);
const reviewRepo = data_source_1.AppDataSource.getRepository(Review_1.Review);
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
router.get('/', async (req, res) => {
    try {
        const hospitals = await hospitalRepo.find({
            relations: ['reviews'],
            order: { averageRating: 'DESC' }
        });
        res.json(hospitals);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching hospitals', error });
    }
});
router.get('/search/query', async (req, res) => {
    try {
        const { name, area, minRating } = req.query;
        let query = hospitalRepo.createQueryBuilder('hospital');
        if (name) {
            query = query.where('hospital.name ILIKE :name', { name: `%${name}%` });
        }
        if (area) {
            query = query.andWhere('hospital.area ILIKE :area', { area: `%${area}%` });
        }
        if (minRating) {
            query = query.andWhere('hospital.averageRating >= :minRating', { minRating: parseFloat(minRating) });
        }
        const hospitals = await query.leftJoinAndSelect('hospital.reviews', 'reviews').getMany();
        res.json(hospitals);
    }
    catch (error) {
        res.status(500).json({ message: 'Error searching hospitals', error });
    }
});
router.get('/search/suggestions', async (req, res) => {
    try {
        const { q: query, limit = 8 } = req.query;
        if (!query || typeof query !== 'string' || query.length < 2) {
            return res.json([]);
        }
        const searchQuery = query;
        const limitNum = parseInt(limit) || 8;
        const hospitals = await hospitalRepo
            .createQueryBuilder('hospital')
            .leftJoinAndSelect('hospital.reviews', 'reviews')
            .where('hospital.name ILIKE :search', { search: `%${searchQuery}%` })
            .orWhere('hospital.area ILIKE :search', { search: `%${searchQuery}%` })
            .orWhere('hospital.specialization ILIKE :search', { search: `%${searchQuery}%` })
            .orWhere('hospital.doctorName ILIKE :search', { search: `%${searchQuery}%` })
            .orderBy('hospital.averageRating', 'DESC')
            .addOrderBy('hospital.name', 'ASC')
            .limit(limitNum)
            .getMany();
        const suggestions = hospitals.map(hospital => {
            let relevanceScore = 0;
            const nameLower = hospital.name.toLowerCase();
            const areaLower = hospital.area.toLowerCase();
            const specializationLower = hospital.specialization.toLowerCase();
            const doctorLower = hospital.doctorName.toLowerCase();
            const queryLower = searchQuery.toLowerCase();
            if (nameLower === queryLower)
                relevanceScore += 100;
            if (areaLower === queryLower)
                relevanceScore += 90;
            if (specializationLower === queryLower)
                relevanceScore += 80;
            if (doctorLower === queryLower)
                relevanceScore += 70;
            if (nameLower.startsWith(queryLower))
                relevanceScore += 50;
            if (areaLower.startsWith(queryLower))
                relevanceScore += 45;
            if (specializationLower.startsWith(queryLower))
                relevanceScore += 40;
            if (doctorLower.startsWith(queryLower))
                relevanceScore += 35;
            if (nameLower.includes(queryLower))
                relevanceScore += 25;
            if (areaLower.includes(queryLower))
                relevanceScore += 20;
            if (specializationLower.includes(queryLower))
                relevanceScore += 15;
            if (doctorLower.includes(queryLower))
                relevanceScore += 10;
            relevanceScore += hospital.averageRating * 2;
            return Object.assign(Object.assign({}, hospital), { relevanceScore, matchType: nameLower.includes(queryLower) ? 'name' :
                    areaLower.includes(queryLower) ? 'area' :
                        specializationLower.includes(queryLower) ? 'specialization' : 'doctor' });
        });
        suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore);
        res.json(suggestions);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching search suggestions', error });
    }
});
router.get('/nearby/:lat/:lng', async (req, res) => {
    try {
        const userLat = parseFloat(req.params.lat);
        const userLng = parseFloat(req.params.lng);
        const distanceKm = req.query.distance ? parseFloat(req.query.distance) : 10;
        const hospitals = await hospitalRepo.find({ relations: ['reviews'] });
        const nearby = hospitals
            .map(h => (Object.assign(Object.assign({}, h), { distance: calculateDistance(userLat, userLng, Number(h.latitude), Number(h.longitude)) })))
            .filter(h => h.distance <= distanceKm)
            .sort((a, b) => a.distance - b.distance);
        res.json(nearby);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching nearby hospitals', error });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const hospital = await hospitalRepo.findOne({
            where: { id: req.params.id },
            relations: ['reviews', 'reviews.user']
        });
        if (!hospital)
            return res.status(404).json({ message: 'Hospital not found' });
        res.json(hospital);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching hospital', error });
    }
});
exports.default = router;
//# sourceMappingURL=hospitals.js.map