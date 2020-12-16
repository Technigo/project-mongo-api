import mongoose from 'mongoose'
//second param --> object--> called schema
//start with capital letter reserved for Models in Mongoose.
//string is going to be name of collection with the 1st string param -->  start with lower case and with and ends with an s
//isbn is a string because some items have letters 
const Book = new mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: String,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

export default Book