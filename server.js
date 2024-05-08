import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import expressListEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

dotenv.config();

// Set up mongoUrl & for localhost netflixTitles-url
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/netflixTitles";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// import the data
import netflixTitlesData from "./data/netflix-titles.json";
import NetflixTitle from "./model/NetflixTitle";

// Seed the database
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await NetflixTitle.deleteMany({});

    netflixTitlesData.forEach((netflixTitle) => {
      // Check for missing fields and set them to "Unknown"
      const requiredFields = ["title", "director", "cast", "country"];

      requiredFields.forEach((field) => {
        if (!netflixTitle[field]) {
          // Set default if missing
          netflixTitle[field] = "Unknown";
        }
      });
      const newNetflixTitle = new NetflixTitle(netflixTitle);
      newNetflixTitle.save();
    });
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
app.use((req, res, next) => {
  // Middleware to check if database in a good state, get the next, otherwise error-message
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

// Route to show documentation of the API
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

// Start defining your routes here
// Retrieve all Netflix titles & accept query parameters for filtering
app.get("/netflixTitles", async (req, res) => {
  try {
    // Extract query parameters for filtering
    const {
      title,
      director,
      cast,
      country,
      release_year,
      rating,
      duration,
      listed_in,
      type,
    } = req.query;

    // Construct filter object based on provided query params
    const filter = {};
    //Case-insensitive param search
    if (title) filter.title = { $regex: title, $options: "i" };
    if (director) filter.director = { $regex: director, $options: "i" };
    if (cast) filter.cast = { $regex: cast, $options: "i" };
    if (country) filter.country = { $regex: country, $options: "i" };
    if (release_year) filter.release_year = release_year;
    if (rating) filter.rating = { $regex: rating, $options: "i" };
    if (duration) filter.duration = { $regex: duration, $options: "i" };
    if (listed_in) filter.listed_in = { $regex: listed_in, $options: "i" };
    if (type) filter.type = { $regex: type, $options: "i" };

    const allNetflixTitles = await NetflixTitle.find(filter);

    if (allNetflixTitles.length > 0) {
      res.json(allNetflixTitles);
    } else {
      res.status(404).json({ error: "No Netflix titles found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Retrieve one netflixTitle with mongoose based on id:
app.get("/netflixTitles/:netflixId", async (req, res) => {
  const { netflixId } = req.params;
  const netflixTitle = await NetflixTitle.findById(netflixId).exec();
  if (netflixTitle) {
    res.json(netflixTitle);
  } else {
    res.status(404).send("No netflix-title was found");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
