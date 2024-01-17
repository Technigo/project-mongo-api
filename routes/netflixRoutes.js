import express from "express";
import { NetflixTitle } from "../models/netflixTitleModel";

const router = express.Router();

// Get All Netflix Titles
router.get("/titles", async (req, res) => {
  try {
    const titles = await NetflixTitle.find();
    res.json(titles);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a Single Netflix Title
router.get("/titles/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const title = await NetflixTitle.findById(id);
    if (title) {
      res.json(title);
    } else {
      res.status(404).json({ error: "Title not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a New Netflix Title
router.post("/titles", async (req, res) => {
  try {
    const newTitle = req.body;
    const createdTitle = await NetflixTitle.create(newTitle);
    res.status(201).json(createdTitle);
  } catch (error) {
    console.error("Error adding title:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a Netflix Title
router.put("/titles/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTitle = await NetflixTitle.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (updatedTitle) {
      res.json(updatedTitle);
    } else {
      res.status(404).json({ error: "Title not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a Netflix Title
router.delete("/titles/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTitle = await NetflixTitle.findByIdAndDelete(id);
    if (deletedTitle) {
      res.json({ message: "Title deleted successfully" });
    } else {
      res.status(404).json({ error: "Title not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Netflix Titles by Release Year
router.get("/titles/year/:releaseYear", async (req, res) => {
  const { releaseYear } = req.params;
  try {
    const titles = await NetflixTitle.find({ release_year: parseInt(releaseYear) });
    res.json(titles);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
