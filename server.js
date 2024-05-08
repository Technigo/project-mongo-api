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
// Retrieve all Netflix titles
app.get("/netflixTitles", async (req, res) => {
  try {
    const allNetflixTitles = await NetflixTitle.find();

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
