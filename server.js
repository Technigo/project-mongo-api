import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";

//import data
import whoData from "./data/doctorwho.json";

//establish connection to MongoDB database using Mongoose
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/doctorwho-data";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

//define schema
const { Schema } = mongoose;

const episodeSchema = new Schema({
  episode_title: String,
  doctor_actor: String,
  companion: String,
  summary: String,
  air_date: String,
});

//define model
const Episode = mongoose.model("Episode", episodeSchema);

//seed the database
const seedDatabase = () => {
  whoData.forEach((episode) => {
    new Episode(episode).save();
  });
};
seedDatabase();

//defines the port the app will run on
const port = process.env.PORT || 8080;
const app = express();

//add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//routes
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

//1️⃣ endpoint that returns all episodes
//example: http://localhost:8080/episodes
app.get("/episodes", async (req, res) => {
  const episodes = await Episodes.find();
  res.json(episodes);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
