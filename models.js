import mongoose from 'mongoose'

export const Shows = mongoose.model('Shows', {
  "title": String,
  "director": [String],
  "cast": [String],
  "country": [String],
  "release_year": Number,
  "description": String,
  "type": String,
})