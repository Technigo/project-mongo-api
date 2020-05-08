import mongoose from 'mongoose'

export const Food = mongoose.model('Food', {
  name: String,
  typeOf: String,
  ingredients: Number,
  time: Number,
})