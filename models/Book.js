import mongoose from "mongoose";

const { Schema } = mongoose

export const bookSchema = new Schema({
    bookID: {
        type: Number
    },
    title: {
        type: String 
    }, 
    authors: {
        type: String
    }, 
    average_rating: {
        type: Number
    }, 
    num_pages: {
        type: Number
    }
})

//Create a Mongoose model named "BookModel"
//This model is used to interact with the "books collection" in the MongoDB Database. It allows you to perform CRUD operations om documents in that collection and provides methods fro data validation based on the schema.
export const BookModel = mongoose.model("Book", bookSchema)