import mongoose from "mongoose";

const { Schema } = mongoose;

// Schema (the blueprint)
export const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  authors: {
    type: String,
    required: true,
  },
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});

// Create mongoose-model
const Book = mongoose.model("Book", BookSchema);

// Export model
export default Book;
