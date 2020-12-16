import mongoose from 'mongoose'
//second param --> object--> called schema
//start with capital letter reserved for Models in Mongoose.
//string is going to be name of collection with the 1st string param -->  start with lower case and with and ends with an s
//what to do with isbn? one of the isbn:s is not a number. it has an X
const Book = new mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

export default Book