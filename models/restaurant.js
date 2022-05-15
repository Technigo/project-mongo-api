import mongoose from "mongoose";

const restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a text value"],
  },
  city: {
    type: String,
    required: [true, "Please add a text value"],
  },
  area: {
    type: String,
    required: [true, "Please add a text value"],
  },
  price: String,
  category: Array,
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
