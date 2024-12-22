import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import avocadoSalesData from "./data/avocado-sales.json";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGODB_URI || "mongodb://127.0.0.1/project-mongo"; // Use MONGO_URL consistently

// Connect to MongoDB
mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("🚀 MongoDB successfully connected!"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Define Mongoose model
const AvocadoSale = mongoose.model(
  "AvocadoSale",
  new mongoose.Schema({
    id: Number,
    date: String,
    averagePrice: Number,
    totalVolume: Number,
    totalBagsSold: Number,
    smallBagsSold: Number,
    largeBagsSold: Number,
    xLargeBagsSold: Number,
    region: String,
  })
);

const app = express();
const port = process.env.PORT || 8080;

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    console.log("Resetting database...");
    await AvocadoSale.deleteMany({});
    const inserted = await AvocadoSale.insertMany(avocadoSalesData);
    console.log(`✅ Database seeded with ${inserted.length} entries!`);
  };
  seedDatabase();
}

app.use(cors());
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Avocado Sales API!",
    endpoints: [
      { method: "GET", path: "/avocado-sales", description: "Get all sales or filter data" },
      { method: "GET", path: "/avocado-sales/:id", description: "Get a single sale by ID" },
    ],
  });
});

// Endpoint to get all sales or filter data
app.get("/avocado-sales", async (req, res) => {
  const { region, date, min, max } = req.query;
  const query = {};

  if (region) query.region = new RegExp(region, "i");
  if (date) query.date = date;
  if (min || max) {
    query.averagePrice = {};
    if (min) query.averagePrice.$gte = Number(min);
    if (max) query.averagePrice.$lte = Number(max);
  }

  try {
    const sales = await AvocadoSale.find(query);
    if (sales.length === 0) {
      return res.status(404).json({ error: "No sales data found with the provided filters." });
    }
    res.json(sales);
  } catch (error) {
    console.error("Error retrieving sales data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to get a single sale by ID
app.get("/avocado-sales/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const sale = await AvocadoSale.findOne({ id: Number(id) });
    if (!sale) {
      return res.status(404).json({ error: "No sales data found for the given ID." });
    }
    res.json(sale);
  } catch (error) {
    console.error("Error retrieving sale by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
