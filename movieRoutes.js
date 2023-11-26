import express from 'express';
import Movie from './movieModel';

// Create an Express Router
const router = express.Router();

// Route to get all movies
router.get('/movies', async (req, res) => {
    try {
        // Fetch all movies from the Movie collection
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        // Handle server error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get a single movie by ID
router.get('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Find a movie by its show_id in the Movie collection
        const movie = await Movie.findOne({ show_id: id });
        if (movie) {
            res.json(movie);
        } else {
            // Respond with 404 if the movie is not found
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (error) {
        // Handle server error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all movie titles
router.get('/titles', async (req, res) => {
    try {
        // Fetch all movies and select only the 'title' field
        const titles = await Movie.find().select('title');
        res.json(titles);
    } catch (error) {
        // Handle server error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all movie actors
router.get('/actors', async (req, res) => {
    try {
        // Fetch all movies and select only the 'cast' field
        const actors = await Movie.find().select('cast');
        res.json(actors);
    } catch (error) {
        // Handle server error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Export the router for use in other files
export default router;
