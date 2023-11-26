import mongoose from 'mongoose';

// Define the Mongoose schema for the Movie model
const movieSchema = new mongoose.Schema({
    show_id: Number,
    title: String,
    director: String,
    cast: String,
    country: String,
    date_added: String,
    release_year: Number,
    rating: String,
    duration: String,
    listed_in: String,
    description: String,
    type: String,
});

// Create a Mongoose model based on the schema
const Movie = mongoose.model('Movie', movieSchema);

// Export the Movie model for use in other files
export default Movie;