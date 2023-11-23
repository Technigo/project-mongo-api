import express from 'express';
import Bird from '../models/birdModel.js';

const router = express.Router();

// Get birds based on their habitat
router.get('/:habitat', async (req, res, next) => {
    try {
        const birds = await Bird.find({ habitat: req.params.habitat }).populate('family');
        res.json(birds);
    } catch (error) {
        next(error);
    }
});

export default router;
