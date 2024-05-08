import mongoose from "mongoose"
const { Schema } = mongoose
// Define schema
export const restaurantSchema = new Schema({
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
    required: true,
  },
  id: {
    type: Number,
    required: true,
    unique: true,
  },
})

// Create model
export const Restaurant = mongoose.model("Restaurant", restaurantSchema)
