import mongoose from "mongoose";

const { Schema } = mongoose;

export const bookSchema = new Schema({
  // Adding a schema to the database
  book: {
    bookID: {
      type: Number,
      //required: true,
    },
    title: {
      type: String,
      //required: true,
    },
    authors: {
      type: String,
      //required: true,
    },
    average_rating: {
      type: Number,
      //required: true,
    },
    isbn: {
      type: Number,
      //required: true,
    },
    isbn13: {
      type: Number,
      //required: true,
    },
    language_code: {
      type: String,
      //required: true,
    },
    num_pages: {
      type: Number,
      //required: true,
    },
    ratings_count: {
      type: Number,
      //required: true,
    },
    text_reviews_count: {
      type: Number,
      //required: true,
    },
  },
});

export const BookModel = mongoose.model("books", bookSchema); // Exporting the model to be used elsewhere in the application
