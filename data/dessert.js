import mongoose from 'mongoose'

export const Dessert = mongoose.model('Dessert', {
  name: String,
  typeOf: String,
  ingredients: Number,
  img_url: String,
  time: Number,
  recipe: String,
})
