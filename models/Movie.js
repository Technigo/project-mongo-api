import mongoose from "mongoose";

const { Schema } = mongoose;

export const movieSchema = new Schema({
    // Complex Object Config
    show_id: { type: Number, },
    title: { type: String },
    director: { type: String },
    cast: { type: String },
    country: { type: String },
    date_added: { type: String },
    release_year: { type: Number },
    rating: { type: String },
    duration: { type: String },
    listed_in: { type: String },
    description: { type: String },
    type: { type: String }
});

// Create a Mongoose model named 'MovieModel' based on the 'movieSchema' for the 'Movie' collection
// This model is used to interact with the "Movie" collection in the MongoDB database. It allows you to perform CRUD operations on documents in that collection and provides methods for data validation based on the schema.
export const MovieModel = mongoose.model('"Movie"', movieSchema);