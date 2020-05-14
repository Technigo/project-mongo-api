import mongoose from 'mongoose'

const Nomination = mongoose.model('Nomination', {
  "year_film": Number,
  "year_award": Number,
  "ceremony": Number,
  "category": String,
  "nominee": String,
  "film": String,
  "win": Boolean
})

export default Nomination