import mongoose from "mongoose";
const { Schema } = mongoose;

const bookSchema = new Schema({

    bookID: Number,
    title: String,
    authors: String,
    average_rating: Number,
    isbn: String,
    isbn13: String,
    language_code: String,
    num_pages: Number,
    ratings_count: Number,
    text_reviews_count: Number,
    
    },
);

const Book = mongoose.model("Book", bookSchema);

export default Book;

