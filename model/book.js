
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const BookModel = new Schema({
  bookID: { type: Number },
  title: { 
    type: String,
    required: true, 
    },
  authors: { 
    type: String,
    required: true, 
   },
  average_rating: { type: Number },
  language_code: { type: String },
  num_pages:  { type: Number },
  ratings_count:  { type: Number },
  text_reviews_count:  { type: Number },
  
})

module.exports = new mongoose.model('Book', BookModel)