import express, { query } from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

import netflixData from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8000;
const app = express();

const Content = mongoose.model("Content", {
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String,
});

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({
      error: "Connection problems",
    });
  }
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Content.deleteMany();

    netflixData.forEach((item) => {
      const newContent = new Content(item);
      newContent.save();
    });
  };
  seedDatabase();
}

// Start defining your routes here
app.get("/", async (req, res) => {
  const content = await Content.find();
  res.json(content);
});

app.get("/endpoints", (req, res) => {
  res.send(listEndpoints(app));
});

app.get("/search", async (req, res) => {
  const { country, director } = req.query;

  try {
    const searchContent = await Content.find({
      country: new RegExp(country, "i"),
      director: new RegExp(director, "i"),
    });
    if (searchContent.length > 0) {
      res.status(200).json({
        message: searchContent,
        success: true,
      });
    } else {
      res.status(404).json({
        message: "Data not found",
        success: false,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Invalid request",
      success: false,
    });
  }
});

app.get("/year/:year", async (req, res) => {
  try {
    const searchYear = req.params.year;

    const findYear = await Content.find({
      release_year: searchYear,
    });

    if (searchYear && findYear.length > 0) {
      res.status(200).json({
        message: findYear,
        success: true,
      });
    } else {
      res.status(404).json({
        message: "Data not found",
        success: false,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "Invalid request",
      success: false,
    });
  }
});

app.get("/type/:type", async (req, res) => {
  try {
    const searchType = req.params.type;
    const findType = await Content.find({ type: searchType });
    if (searchType && findType.length > 0) {
      res.status(200).json({
        message: findType,
        success: true,
      });
    } else {
      res.status(404).json({
        message: "Data not found",
        success: false,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "Invalid request",
      success: false,
    });
  }
});

app.get("/titles/:id", async (req, res) => {
  try {
    const title = await Content.findById(req.params.id);
    if (title) {
      res.status(200).json({
        message: title,
        success: true,
      });
    } else {
      res.status(404).json({
        message: "Title not found",
        success: false,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "Invalid request",
      success: false,
    });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
