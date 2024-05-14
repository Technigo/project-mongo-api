import mongoose from "mongoose"
const { Schema } = mongoose

// Define schema
const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  award: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  id: {
    type: Number,
    required: true,
    unique: true,
  },
})

// Create model with mongoose
export const Restaurant = mongoose.model("Restaurant", restaurantSchema)
