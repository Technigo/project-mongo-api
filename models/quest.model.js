import mongoose from "mongoose";

const QuestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  reward: String,
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Character" }],
});

export const Quest = mongoose.model("Quest", QuestSchema);
