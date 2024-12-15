import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import goldenGlobesData from "./data/golden-globes.json";

import dotenv from 'dotenv';
dotenv.config();

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("❌ MONGO_URL is not defined in .env. Please add it and restart the server.");
  process.exit(1);
}

mongoose.connect(mongoUrl)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas. Please check:");
    console.error("Is MONGO_URL correct in your .env?");
    console.error("Do you have access to the cluster?");
    console.error(err);
    process.exit(1);
  });

mongoose.Promise = global.Promise;

const GoldenGlobe = mongoose.model("GoldenGlobe", {
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  win: Boolean,
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    try {
      console.log("Resetting and seeding database...");
      await GoldenGlobe.deleteMany();
      await GoldenGlobe.insertMany(goldenGlobesData);
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  };
  seedDatabase();
}

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the Golden Globes API!",
    endpoints: {
      "/golden-globes": "Get all Golden Globes nominations",
      "/golden-globes/winners": "Get all winners",
      "/golden-globes/category/:category": "Get nominations by category",
      "/golden-globes/nominee/:nominee": "Get nomination by nominee",
    },
  });
});

app.get("/golden-globes", async (req, res) => {
  try {
    const nominations = await GoldenGlobe.find();
    res.json(nominations);
  } catch (error) {
    console.error("Error fetching nominations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/golden-globes/winners", async (req, res) => {
  try {
    const winners = await GoldenGlobe.find({ win: true });
    res.json(winners);
  } catch (error) {
    console.error("Error fetching winners:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/golden-globes/category/:category", async (req, res) => {
  const { category } = req.params;
  try {
    const nominees = await GoldenGlobe.find({ category });
    if (nominees.length > 0) {
      res.json(nominees);
    } else {
      res.status(404).json({ error: "No nominations found for this category" });
    }
  } catch (error) {
    console.error(`Error fetching nominations for category: ${category}`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/golden-globes/nominee/:nominee", async (req, res) => {
  const { nominee } = req.params;
  try {
    const result = await GoldenGlobe.findOne({ nominee });
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "Nominee not found" });
    }
  } catch (error) {
    console.error(`Error fetching nominee: ${nominee}`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
