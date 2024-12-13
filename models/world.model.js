import mongoose from "mongoose";

const WorldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});

export const World = mongoose.model("World", WorldSchema);
