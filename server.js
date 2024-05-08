import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import flowers from "./data/flowers.json";

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

// Seed the database
const seedDatabase = async () => {
  if (process.env.RESET_DATABASE) {
    console.log("Resetting and seeding");
    await Flower.deleteMany();

    flowers.forEach((flower) => {
      new Flower(flower).save();
    });
  }
};

// Defines the port the app will run on.
const port = process.env.PORT || 3000;
const app = express();

// Middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Route defining
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Get all the flowers
app.get("/flowers", async (req, res) => {
  try {
    const allFlowers = await Flower.find();
    res.json(allFlowers);
  } catch (error) {
    console.error("Error fetching flowers:", error);
    res.status(500).json({ error: "Error fetching flowers" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
