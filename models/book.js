import mongoose from 'mongoose'

const Book = mongoose.model('Book', {
  bookID: {
    type: Number,
  },
  title: {
    type: String,
  },
  authors: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  average_rating: {
    type: Number,
  },
  isbn: {
    type: Number,
  },
  isbn13: {
    type: Number,
  },
  language_code: {
    type: String,
  },
  num_pages: {
    type: Number,
  },
  ratings_count: {
    type: Number,
  },
  text_reviews_count: {
    type: Number,
  }
})

export default Book

