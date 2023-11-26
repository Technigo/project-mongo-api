
// Import the Mongoose library, which helps interact with MongoDB in Node.js
import mongoose from 'mongoose';

// Define the Mongoose schema for the Movie model
const movieSchema = new mongoose.Schema({
    // Define the structure of a movie document in the Movie collection
    show_id: Number, // Unique identifier for the movie
    title: String,  // Movie title
    director: String, // Director's name
    cast: String, // Cast or actors in the movie
    country: String, // Country where the movie was produced
    date_added: String, // Date when the movie was added to the collection
    release_year: Number, // Year the movie was released
    rating: String, // Movie rating
    duration: String, // Duration of the movie
    listed_in: String, // Categories or genres the movie is listed in
    description: String, // Brief description of the movie
    type: String, // Type of content (e.g., movie or TV show)
});

// Create a Mongoose model based on the schema
const Movie = mongoose.model('Movie', movieSchema);

// Export the Movie model for use in other files
export default Movie;