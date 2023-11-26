// Import necessary modules.
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import netflixShowRoutes from "./routes/netflixShowRoutes";
import netflixShowsData from "./data/netflix-titles.json";
import { NetflixShowModel } from "./models/NetflixShow";

// Load environment variables from a .env file. Try-catch block to handle errors.
try {
  dotenv.config();
} catch (error) {
  console.error("Error loading .env file:", error);
  process.exit(1); // Exit the process on error
}

// Enable strict query mode for Mongoose.
mongoose.set("strictQuery", true);

// Seeding the database - comment out this once the database seeded successfully.
const seedDatabase = async () => {
  try {
    // Remove all existing documents in the Netflix shows collection.
    await NetflixShowModel.deleteMany({});

    // Use map to create an array of promises, one for each document to be saved.
    const savePromises = netflixShowsData.map(async (NetflixShowItem) => {
      // Creating a new NetflixShows document using data from netflixShowItem and returning the promise.
      return new NetflixShowModel(NetflixShowItem).save();
    });

    // Wait for all the promises to resolve before moving on.
    await Promise.all(savePromises);
    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
// Seed the database.
seedDatabase();

// Access the MONGO_URL environment variable, connects to MongoDB using Mongoose and sets Mongoose to use native JavaScript promises.
const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on.
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing.
app.use(cors());
app.use(express.json());

// Connect to the Netflix show routes here.
app.use(netflixShowRoutes);

// Global middleware error handler.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
