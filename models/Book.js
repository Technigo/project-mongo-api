// models/Book.js
import mongoose from "mongoose";

const { Schema } = mongoose;

// Schema - the blueprint
const bookSchema = new Schema(
  {
    bookID: { type: Number, required: true },
    title: { type: String, required: true },
    authors: { type: String, required: true },
    average_rating: { type: Number },
    isbn: { type: Number },
    isbn13: { type: Number },
    language_code: { type: String },
    num_pages: { type: Number },
    ratings_count: { type: Number },
    text_reviews_count: { type: Number }
  },
  {
    timestamps: true,
  }
);

// The model
export const Book = mongoose.model("Book", bookSchema);
