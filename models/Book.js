import mongoose from "mongoose";

// Destructure the Schema object from the mongoose module
const { Schema } = mongoose;

// Define the schema for the Book model
const BookSchema = new Schema({
  bookID: Number,
  title: {
    type: String,
    required: true
  },
  authors: {
    type: String,
    required: true
  },
  average_rating: Number,
  isbn: {
    type: Number,
    required: true,
    min: 0,
  },
  isbn13: {
    type: Number,
    required: true,             
    min: 0,
  },
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
});

// Create the Book model using the schema
const Book = mongoose.model('Book', BookSchema);

// Export the Book model
export default Book;