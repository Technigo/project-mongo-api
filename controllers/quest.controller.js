import { Quest } from "../models/quest.model.js";

export const getQuests = async (req, res) => {
  try {
    const quests = await Quest.find().populate("assignedTo");
    res.status(200).json(quests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quests" });
  }
};

export const createQuest = async (req, res) => {
  try {
    const quest = new Quest(req.body);
    await quest.save();
    res.status(201).json(quest);
  } catch (error) {
    res.status(400).json({ error: "Failed to create quest" });
  }
};
