import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  bookID: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  authors: {
    type: String,
    required: true,
    trim: true,
  },
  average_rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  isbn: {
    type: Number,
    required: true,
    unique: true,
  },
  isbn13: {
    type: Number,
    required: true,
    unique: true,
  },
  language_code: {
    type: String,
    required: true,
  },
  num_pages: {
    type: Number,
    required: true,
  },
  ratings_count: {
    type: Number,
    default: 0,
  },
  text_reviews_count: {
    type: Number,
    default: 0,
  },
});

export const Book = mongoose.model("Book", bookSchema);
