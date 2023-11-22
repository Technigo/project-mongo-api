import mongoose from "mongoose";

const { Schema } = mongoose;

export const bookSchema = new Schema({
    title: {
        type: String,
        minLength: 4
    },
    author: {
        type: String,
        minLength: 4
    },
    language: String,
    rating: Number,
    isbn: {
        type: Number,
        minLength: 9
    },
    numberOfPages: {
        type: Number,
        min: 3
    }
}) 

// Create a Mongoose model named 'BookModel' based on the 'bookSchema' for the 'books' collection
// This model is used to interact with the "books" collection in the MongoDB database. It allows you to perform CRUD operations on documents in that collection and provides methods for data validation based on the schema.
export const BookModel = mongoose.model("books", bookSchema); 