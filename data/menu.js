import mongoose from 'mongoose'

export const Menu = mongoose.model('Menu', {
  name: String,
  typeOf: String,
  ingredients: Number,
  img_url: String,
  time: Number,
})