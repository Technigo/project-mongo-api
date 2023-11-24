import mongoose from "mongoose";

const { Schema } = mongoose

export const bookSchema = new Schema ({
    

title:{
    type: String,
    required: true,
    minLength: 5
},

authors: {
    type: String,
    required: true,
    minLength: 5

},

average_rating: {
    type: Number
},
language_code:{
    type: String
}



});

export const BookModel = mongoose.model("books" , bookSchema)