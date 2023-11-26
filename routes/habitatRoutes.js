import express from 'express';
import Bird from '../models/birdModel.js';

const router = express.Router();

// Get birds based on their habitat
router.get('/:habitat', async (req, res, next) => {
    try {
        const habitat = req.params.habitat.toLowerCase(); // Convert to lowercase for case-insensitive search

        // Find birds with a habitat that matches the specified pattern, ignoring uppercase/lowercase differences.
        const birds = await Bird.find({ habitat: { $regex: new RegExp(habitat, 'i') } }).populate('family');

        if (birds.length) {
            res.json(birds);
        } else {
            res.status(404).json({ error: 'No birds found for the given habitat' });
        }
    } catch (error) {
        next(error);
    }
});

export default router;
