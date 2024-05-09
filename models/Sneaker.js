import mongoose from "mongoose"

//Schema - the blueprint
const { Schema } = mongoose

const sneakerSchema = new Schema({
  brand: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: Number,
  color: String,
  inStock: {
    type: Boolean,
    default: true
  },
})

//Model
const Sneaker = mongoose.model("Sneaker", sneakerSchema)


export default Sneaker