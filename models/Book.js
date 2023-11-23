import mongoose from "mongoose";

const { Schema } = mongoose;

// The keys in schema must match ALL the keys in the json data file, otherwise it won't work!
export const bookSchema = new Schema({
    bookID: Number,
    title: {
        type: String,
    },
    authors: {
        type: String,
        minLength: 4
    },
    average_rating: Number,
    isbn: {
        type: Number,
        minLength: 9
    },
    isbn13: {
        type: Number,
        minLength: 13
    },
    language_code: String,
    num_pages: {
        type: Number,
    },
    ratings_count: {
        type: Number
    },
    text_reviews_count: {
        type: Number
    }
}) 

// Create a Mongoose model named 'BookModel' based on the 'bookSchema' for the 'books' collection
// This model is used to interact with the "books" collection in the MongoDB database. It allows you to perform CRUD operations on documents in that collection and provides methods for data validation based on the schema.
export const BookModel = mongoose.model("books", bookSchema); 