import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Character" },
});

export const Item = mongoose.model("Item", ItemSchema);
