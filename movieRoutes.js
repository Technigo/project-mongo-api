// Import the 'express' library, which helps create web servers in Node.js
import express from 'express';
// Import the 'Movie' model from the 'movieModel' file
import Movie from './movieModel';

// Create an Express Router to define routes
const router = express.Router();

// Route to get all movies
router.get('/movies', async (req, res) => {
    try {
        // Try to fetch all movies from the Movie collection in the database
        const movies = await Movie.find();

        // Respond with the fetched movies in JSON format
        res.json(movies);
    } catch (error) {

        // If there's an error, respond with a 500 Internal Server Error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get a single movie by ID
router.get('/movies/:id', async (req, res) => {
    // Extract the 'id' parameter from the request URL
    const { id } = req.params;
    try {
        // Try to find a movie by its 'show_id' in the Movie collection
        const movie = await Movie.findOne({ show_id: id });

        // If the movie is found, respond with it in JSON format
        if (movie) {
            res.json(movie);
        } else {

            // If the movie is not found, respond with a 404 Not Found status
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (error) {
        // If there's an error, respond with a 500 Internal Server Error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all movie titles
router.get('/titles', async (req, res) => {
    try {
        // Try to fetch all movies from the Movie collection and select only the 'title' field
        const titles = await Movie.find().select('title');

        // Respond with the fetched titles in JSON format
        res.json(titles);
    } catch (error) {

        // If there's an error, respond with a 500 Internal Server Error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all movie actors
router.get('/actors', async (req, res) => {
    try {
        // Try to fetch all movies from the Movie collection and select only the 'cast' field
        const actors = await Movie.find().select('cast');

        // Respond with the fetched actors in JSON format
        res.json(actors);
    } catch (error) {

        // If there's an error, respond with a 500 Internal Server Error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Export the router for use in other files
export default router;
