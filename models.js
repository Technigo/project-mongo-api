import mongoose from 'mongoose'

export const Shows = mongoose.model('Shows', {
  "show_id": Number,
  "title": String,
  "director": [String],
  "cast": [String],
  "country": [String],
  "release_year": Number,
  "description": String,
  "type": String,
})