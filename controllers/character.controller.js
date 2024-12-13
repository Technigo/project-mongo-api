import { Character } from "../models/character.model.js";

export const getCharacters = async (req, res) => {
  try {
    // Extract query params
    const { homeWorld, item } = req.query;

    const filter = {};
    if (homeWorld) filter.homeWorld = homeWorld;
    if (item) filter.item = item;

    const characters = await Character.find(filter)
      .populate("homeWorld")
      .populate("quests")
      .populate("item");
    res.status(200).json(characters);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch characters" });
  }
};

export const createCharacter = async (req, res) => {
  try {
    // Validate required fields
    const { name, role, homeWorld } = req.body;

    // Collect missing fields dynamically
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!role) missingFields.push("role");
    if (!homeWorld) missingFields.push("homeWorld");

    // If there are missing fields, return a 400 error
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Create and save the character
    const character = new Character(req.body);
    await character.save();
    res.status(201).json(character);
  } catch (error) {
    // Check for validation errors from Mongoose
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ error: "Validation error", details: errors });
    }

    // Check for MongoDB duplicate key errors
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Duplicate key error", details: error.keyValue });
    }

    // General server error
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
