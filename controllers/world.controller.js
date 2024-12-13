import { World } from "../models/world.model.js";

export const getWorlds = async (req, res) => {
  try {
    const worlds = await World.find();
    res.status(200).json(worlds);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch worlds" });
  }
};

export const createWorld = async (req, res) => {
  try {
    const world = new World(req.body);
    await world.save();
    res.status(201).json(world);
  } catch (error) {
    res.status(400).json({ error: "Failed to create world" });
  }
};
