import express from "express";
import expressListEndpoints from "express-list-endpoints";

import cors from "cors";
import mongoose from "mongoose";
import { Title } from "./models/Title";
import netflixData from "./data/netflix-titles.json";
require("dotenv").config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Seed the database
  const seedDatabase = async () => {
    console.log('Resetting and seeding')
    await Title.deleteMany();

    netflixData.forEach((item) => {
      new Title(item).save();
    })
  
    console.log("Seeding completed");
  }

  seedDatabase();


// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
