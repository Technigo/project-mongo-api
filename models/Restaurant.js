import mongoose from "mongoose";

export const Restaurant = mongoose.model("User", {
  id: Number,
  name: String,
  star: Number,
  stars_count: Number,
  price: String,
  area: String,
  Category: Array,
});
