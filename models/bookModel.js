// Import the mongoose library for working with MongoDB
import mongoose from 'mongoose';

// Destructure the Schema object from the mongoose module so it can be used directly without having to reference it through mongoose (const bookSchema = new mongoose.Schema).
const { Schema } = mongoose;

// Define the schema for the Book model 
const bookSchema = new Schema({
    bookID: { type: Number, required: true },
    title: { type: String, required: true },
    authors: { type: String, required: true },
    average_rating: { type: Number, required: true },
    isbn: { type: Number, required: true },
    isbn13: { type: Number, required: true },
    language_code: { type: String, required: true },
    num_pages: { type: Number, required: true },
    ratings_count: { type: Number, required: true },
    text_reviews_count: { type: Number, required: true },
});

// Create the Book model based on the schema
// 'books' is the name of the MongoDB collection to store documents of this model
export const Book = mongoose.model('books', bookSchema);
