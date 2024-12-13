import mongoose from "mongoose";

const CharacterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [50, "Name can't be more than 50 characters"],
  },
  role: { type: String, required: true },
  homeWorld: { type: mongoose.Schema.Types.ObjectId, ref: "World" },
  quests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quest" }],
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
});

export const Character = mongoose.model("Character", CharacterSchema);
