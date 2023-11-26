import express from 'express';
import Bird from '../models/birdModel.js';

const router = express.Router();

// Get birds based on their diet
router.get('/:diet', async (req, res, next) => {
    try {
        const diet = req.params.diet.toLowerCase(); // Convert to lowercase for case-insensitive search
        const birds = await Bird.find({ diet: { $regex: new RegExp(diet, 'i') } }).populate('family');

        if (birds) {
            res.json(birds);
        } else {
            res.status(404).json({ error: 'No birds found for the given diet' });
        }
    } catch (error) {
        next(error);
    }
});

export default router;
