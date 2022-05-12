import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";
import listEndpoints from "express-list-endpoints";
import healthyLifestyles from "./data/healthy-lifestyle-cities-2021.json";
import { request } from "express";
import res from "express/lib/response";

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-mongo-week18";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const HealthyCities = mongoose.model("HealthyCities", {
  city: String,
  rank: Number,
  sunshine_hours_city: Number,
  cost_of_a_bottle_of_water_city: Number,
  obesity_levels_country: Number,
  life_expectancy_years_country: Number,
  pollution_index_city: Number,
  annual_hours_worked: Number,
  happiness_levels_country: Number,
  outdoor_activities_city: Number,
  number_of_take_out_places_city: Number,
  cost_of_a_monthly_gym_membership_city: Number,
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await HealthyCities.deleteMany();

    healthyLifestyles.forEach((item) => {
      const lifestyle = new HealthyCities(item);
      lifestyle.save();
    });
  };
  seedDatabase();
}
// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

app.get("/healthyLifestyles", async (req, res) => {
  const allCities = await HealthyCities.find();
  res.json(allCities);
});

// Return only the city you have typed in
app.get("/healthyLifestyles/:city", async (req, res) => {
  const { city } = req.params;

  try {
    const cityByName = await HealthyCities.findOne({
      city: new RegExp(city, "i"),
    });

    if (!cityByName) {
      res.status(404).json({
        error: "not found",
        success: false,
      });
    } else {
      res.status(200).json(cityByName);
    }
  } catch (error) {
    res.status(400).json({
      error: "bad request",
      success: false,
    });
  }
});

// Return the city by the rank number you have typed in
app.get("/healthyLifestyles/rank/:rank", async (req, res) => {
  const { rank } = req.params;

  try {
    const rankNumber = await HealthyCities.findOne({ rank: +rank });

    if (!rankNumber) {
      res.status(404).json({
        error: "not found",
        success: false,
      });
    } else {
      res.status(200).json(rankNumber);
    }
  } catch (error) {
    res.status(400).json({
      error: "bad request",
      success: false,
    });
  }
});

//Return the top contester's
app.get("/healthyLifestyles/top/sunshineHours", async (req, res) => {
  try {
    const sunshineHours = await HealthyCities.find({
      sunshine_hours_city: { $gte: 2600 },
    });
    if (sunshineHours.length === 0) {
      res.status(404).json("sorry no sunshine here");
    }
    res.json(sunshineHours);
  } catch (error) {
    res.status(400).json({
      error: "bad request",
      success: false,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
