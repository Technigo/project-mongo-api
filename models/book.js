import mongoose from 'mongoose'

const Schema = mongoose.Schema

const BookSchema = new Schema({
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
  isbn13: {
    type: Number,
    min: 9780000000000,
    max: 9999999999999
  },
  language_code: {
    type: String
  },
  num_pages: {
    type: Number
  },
  ratings_count: {
    type: Number
  },
  text_reviews_count: {
    type: Number
  },
})

module.exports = new mongoose.model('Book', BookSchema)