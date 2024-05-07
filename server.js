import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import City from "./models/City";
import topCitiesChina from "./data/china-city.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

if (process.env.RESET_DB) {
  const seedDirectorDatabase = async () => {
    await City.deleteMany();
    topCitiesChina.forEach(city => {
      console.log(city);
      new City(city).save();
    });
  };
  seedDirectorDatabase();
}

// Defines the port the app will run on.
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
