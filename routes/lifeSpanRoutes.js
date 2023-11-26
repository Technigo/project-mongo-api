// Import necessary modules
import express from 'express';
import Bird from '../models/birdModel.js';

// Create an Express router
const router = express.Router();

// Get birds within a specified lifespan range
router.get('/lifespan/:min/:max', async (req, res, next) => {
    try {
        // Parse minimum and maximum lifespan values from request parameters
        const minLifespan = parseInt(req.params.min);
        const maxLifespan = parseInt(req.params.max);

        // Check if the provided values are valid numbers
        if (isNaN(minLifespan) || isNaN(maxLifespan)) {
            return res.status(400).json({ error: 'Invalid lifespan values' });
        }

        // Query the database to find birds within the specified lifespan range
        const birds = await Bird.find({
            averageLifespan: { $gte: minLifespan, $lte: maxLifespan }
        }).populate('family');

        // Check if any birds were found
        if (birds.length) {
            // Respond with the list of birds within the specified lifespan range
            res.json(birds);
        } else {
            res.status(404).json({ error: 'No birds found within the specified lifespan range' });
        }
    } catch (error) {
        next(error);
    }
});

// Export the router
export default router;
