import { Item } from "../models/item.model.js";

export const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate("owner");
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

export const createItem = async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: "Failed to create item" });
  }
};
