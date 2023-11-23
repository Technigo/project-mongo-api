import express from 'express';
import Bird from '../models/birdModel.js';

const router = express.Router();

// Get birds based on their diet
router.get('/:diet', async (req, res, next) => {
    try {
        const birds = await Bird.find({ diet: req.params.diet }).populate('family');
        res.json(birds);
    } catch (error) {
        next(error);
    }
});

export default router;
