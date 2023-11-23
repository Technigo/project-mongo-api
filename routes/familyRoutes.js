//define the Express router for family-related routes
import express from 'express';
import BirdFamily from '../models/birdFamilyModel.js';

const router = express.Router();

// Get all bird families
router.get('/', async (req, res, next) => {
    try {
        const families = await BirdFamily.find();
        if (families) {
            res.json(families);
        } else {
            res.status(404).json({ error: 'Bird families not found' });
        }
    } catch (error) {
        next(error);
    }
});

// Get bird family by ID
router.get('/:id', async (req, res, next) => {
    try {
        const family = await BirdFamily.findById(req.params.id);
        if (family) {
            res.json(family);
        } else {
            res.status(404).json({ error: 'Bird family not found' });
        }
    } catch (error) {
        next(error);
    }
});


export default router;
