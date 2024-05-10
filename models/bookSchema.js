import mongoose from "mongoose";

// Doing the Schema for the book
const { Schema, model } = mongoose;
const BookSchema = new Schema({
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isgn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});

// Doing the Book Model with the Schema
const Book = model("Book", BookSchema);

// Exporting the Model
export default Book;
