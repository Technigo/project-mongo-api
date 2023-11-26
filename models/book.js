import mongoose from "mongoose";

const Book = mongoose.model('Book', {
    bookID: Number, 
    title: String, 
    authors: String, 
    average_rating: Number, 
    isbn: Number, 
    isbn13: Number, 
    language_code: String, 
    num_pages: Number, 
    ratings_count: Number, 
    ratings_count: Number, 
    text_reviews_count: Number,
  });

  export default Book;