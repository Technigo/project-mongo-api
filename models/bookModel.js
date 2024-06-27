const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookID: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  authors: {
    type: [String],
    required: true,
  },
  average_rating: {
    type: Number,
    default: 0,
  },
  language_code: {
    type: String,
    required: true,
  },
  num_pages: {
    type: Number,
    default: 0,
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
