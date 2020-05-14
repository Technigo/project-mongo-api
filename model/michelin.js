import mongoose from 'mongoose'

const Michelin = mongoose.model('Michelin',{
  name: String,
  year: Number,
  latitude: Number,
  longitude: Number,
  city: {
    type: String,
    lowercase: true,
  },
  region: {
    type: String,
    lowercase: true,
  },
  zipCode: String,
  cuisine: {
    type: String,
    lowercase: true,
  },
  price: String,
  url: String,
})

export default Michelin