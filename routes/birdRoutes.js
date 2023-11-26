//define the Express router for bird-related routes
import express from 'express';
import Bird from '../models/birdModel.js';

const router = express.Router();

// Get all birds
router.get('/', async (req, res, next) => {
    try {
        const birds = await Bird.find().populate('family');
        res.json(birds);
    } catch (error) {
        next(error);
    }
});

// Get single bird by ID
router.get('/:id', async (req, res, next) => {
    try {
        const bird = await Bird.findById(req.params.id).populate('family');
        if (bird) {
            res.json(bird);
        } else {
            res.status(404).json({ error: 'Bird not found' });
        }
    } catch (error) {
        next(error);
    }
});

// Get single bird by name
router.get('/name/:name', async (req, res, next) => {
    try {
        const bird = await Bird.findOne({ name: req.params.name }).populate('family');
        if (bird) {
            res.json(bird);
        } else {
            res.status(404).json({ error: 'Bird not found' });
        }
    } catch (error) {
        next(error);
    }
});
export default router;