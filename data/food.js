import mongoose from 'mongoose'

export const Food = mongoose.model('Food', {
  name: String,
  typeOf: String,
  ingredients: Number,
  img_url: String,
  time: Number,
})

// img url
// love mums: https://dailyinakitchen.files.wordpress.com/2016/01/img_5470.jpg?w=1240&h=826
// buns: https://images.unsplash.com/photo-1509365465985-25d11c17e812?ixlib=rb-1.2.1&auto=format&fit=crop&w=1275&q=80
// pie: https://images.unsplash.com/photo-1580913387627-a33eb3d2f02d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80
// https://images.unsplash.com/photo-1580913387657-59fa4c6b1a91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80
// https://images.unsplash.com/photo-1587248721852-ffc60bffc129?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80