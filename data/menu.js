import mongoose from 'mongoose'

export const Menu = mongoose.model('Menu', {
  name: String,
  typeOf: String,
  ingredients: Number,
  img_url: String,
  time: Number,
})

// img url:
// pasta: https://images.unsplash.com/photo-1516100882582-96c3a05fe590?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80
// https://images.unsplash.com/photo-1580038595254-c44b011964cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80
// tacos: https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80
// meatballs: https://thecozyapron.com/wp-content/uploads/2018/05/swedish-meatballs_thecozyapron_1.jpg
