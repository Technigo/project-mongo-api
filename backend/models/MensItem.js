import mongoose from "mongoose";

const { Schema } = mongoose;
//Set the model
export const MensitemSchema = new Schema({
  name: String,
  category: String,
  price: Number,
  currency: String,
  color: String,
  size: Array,
  quantity_sold: Number,
  quantity_in_stock: Number,
  isPromotion: Boolean,
});

export const MensItemsModel = mongoose.model("mensitems", MensitemSchema);
