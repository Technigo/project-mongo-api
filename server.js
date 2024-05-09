import express, { query } from "express";
import cors from "cors";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";
import netflixData from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Schema
const { Schema } = mongoose;

const netflixTitleSchema = new Schema({
  show_id: Number,
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

// Model
const NetflixTitle = mongoose.model("NetflixTitle", netflixTitleSchema);

// Seed the database
const seedDatabase = async () => {
  console.log("Resetting and seeding");
  await NetflixTitle.deleteMany();

  netflixData.forEach((item) => {
    new NetflixTitle(item).save();
  });
};
seedDatabase();

// Defines the port the app will run on.
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Generate endpoint details
const generateQueryUsage = (endpoint) => {
  const queryUsage = {};
  if (endpoint.path === "/netflix-titles") {
    queryUsage.page = "Filter by page";
    queryUsage.title = "Filter by title (case-insensitive)";
    queryUsage.country = "Filter by country (case-insensitive)";
  }
  return queryUsage;
};

// Routes
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app).map((endpoint) => ({
    path: endpoint.path,
    methods: endpoint.methods,
    query: generateQueryUsage(endpoint),
  }));
  res.json(endpoints);
});

// Display netflix titles
app.get("/netflix-titles", async (req, res) => {
  // Set up limit of number of titles shown on each page
  const page = parseInt(req.query.page) || 1;
  const pageItemsNumber = 20;
  const skippedItems = (page - 1) * pageItemsNumber;

  // Adding some query params
  const searchTitle = req.query.title;
  const searchCountry = req.query.country;

  // Filter based on title
  let query = {};
  if (searchTitle) {
    query.title = { $regex: searchTitle, $options: "i" };
  }
  // Filter based on country
  if (searchCountry) {
    query.country = { $regex: searchCountry, $options: "i" };
  }

  // Get the shows and movies and apply pagination
  const netflixTitles = await NetflixTitle.find(query)
    .skip(skippedItems)
    .limit(pageItemsNumber)
    .exec();

  if (netflixTitles.length > 0) {
    res.json(netflixTitles);
  } else {
    res.status(404).send("No movie or show found based on filters");
  }
});

// Get movie or show based on id
app.get("/netflix-titles/:titleId", async (req, res) => {
  const { titleId } = req.params;
  const netflixTitle = await NetflixTitle.findById(titleId).exec();

  if (netflixTitle) {
    res.json(netflixTitle);
  } else {
    res.status(404).send("No movie or show found");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
