import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";
import flowers from "./data/flowers.json";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/flowers";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const { Schema } = mongoose;

// Schema - the blueprint
const flowerSchema = new Schema({
  name: String,
  price: Number,
  color: String,
  inStock: Boolean,
  quantity: Number,
});

// The model
const Flower = mongoose.model("Flower", flowerSchema);

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    try {
      await Flower.deleteMany({});
      flowers.forEach((flower) => {
        new Flower(flower).save();
      });
      console.log("Database seeded successfully");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  };

  seedDatabase();
}

// Defines the port the app will run on.
const port = process.env.PORT || 3000;
const app = express();

// Middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Route defining
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

// Get all the flowers
// To filter by color, for example red: http://localhost:3000/flowers?color=red
app.get("/flowers", async (req, res) => {
  try {
    let query = {};

    // Check if query parameter for filtering by color exists
    if (req.query.color) {
      query.color = { $regex: new RegExp(req.query.color, "i") };
    }

    const flowers = await Flower.find(query);

    // Check if flowers are found
    if (flowers.length === 0) {
      return res
        .status(404)
        .json({ message: "No flowers found matching the criteria." });
    }

    // Send the filtered flowers as response
    res.json(flowers);
  } catch (error) {
    console.error("Error fetching flowers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a single flower by ID or numeric ID
app.get("/flowers/:id", async (req, res) => {
  try {
    let flower;
    if (!isNaN(req.params.id)) {
      // If the ID is numeric, convert it to ObjectId
      flower = await Flower.findOne({ id: parseInt(req.params.id) });
    } else {
      flower = await Flower.findById(req.params.id);
    }
    if (!flower) {
      return res.status(404).json({ error: "Flower not found" });
    }
    res.json(flower);
  } catch (error) {
    console.error("Error fetching flower:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
