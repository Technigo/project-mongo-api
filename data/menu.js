import mongoose from 'mongoose'

export const Menu = mongoose.model('Menu', {
  name: String,
  typeOf: String,
  ingredients: Number,
  time: Number,
})