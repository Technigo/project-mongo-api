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

// Seed the database
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    console.log("Resetting and seeding");
    await Title.deleteMany();

    netflixData.forEach((item) => {
      new Title(item).save();
    });
    console.log("Seeding completed");
  };
  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const paginateQuery = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  req.pagination = {
    page,
    limit,
    skip: (page - 1) * limit,
  };
  next();
};

const generateQueryUsage = (endpoint) => {
  const queryUsage = {};
  if (endpoint.path === "/titles") {
    queryUsage.name = "Filter by title name (case-insensitive)";
    queryUsage.type =
      "Filter by title type, either `tv` or `movie` (case-insensitive)";
    queryUsage.cast = "Filter by featured cast (case-insensitive)";
    queryUsage.country = "Filter by different countries (case-insensitive)";
  }
  return queryUsage;
};

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app).map((endpoint) => ({
    path: endpoint.path,
    methods: endpoint.methods,
    query: generateQueryUsage(endpoint),
  }));
  res.json(endpoints);
});

// Route for all titles and filters
app.get("/titles", paginateQuery, async (req, res) => {
  const { name, type, cast, country } = req.query;
  let query = {};

  if (name) query.title = { $regex: name, $options: "i" };
  if (type) query.type = { $regex: type, $options: "i" };
  if (cast) query.cast = { $regex: cast, $options: "i" };
  if (country) query.country = { $regex: country, $options: "i" };

  const allTitles = await Title.find(query)
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .exec();

  if (allTitles.length === 0) {
    res.status(404).send("No titles were found");
  } else {
    res.json(allTitles);
  }
});

// Route for one title by ID
app.get("/titles/:titleId", async (req, res) => {
  const { titleId } = req.params;

  const byId = await Title.findById(titleId).exec();

  if (byId) {
    res.json(byId);
  } else {
    res.status(404).send("No title found by that id");
  }
});

// Route for titles by year
app.get("/titles/year/:year", paginateQuery, async (req, res) => {
  const year = req.params.year;

  const byYear = await Title.find({ release_year: year })
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .exec();

  if (byYear.length > 0) {
    res.json(byYear);
  } else {
    res.status(404).send("No title found by that year");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
