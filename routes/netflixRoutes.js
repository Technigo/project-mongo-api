import express from "express";
import Data from "../data/netflix-titles.json";
import NetflixTitle from "../models/netflixTitleModel"

const router = express.Router();

// Get All Netflix Titles
router.get("/", async (req, res) => {
  try {
    const titles = await NetflixTitle.find();
    res.json(titles);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a Single Netflix Title
router.get("/:id", async (req, res) => {
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

export default router;