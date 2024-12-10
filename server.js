import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import NetflixTitle from "./models/NetflixTitles";
import netflixTitlesData from "./data/netflix-titles.json";
import expressListEndpoints from "express-list-endpoints";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/netflixTitles";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    try {
      await NetflixTitle.deleteMany({});

      netflixTitlesData.forEach(async (netflixTitle) => {
        await NetflixTitle.create(netflixTitle);
      });

      console.log("Netflix titles database seeded successfully");
    } catch (error) {
      console.error("Error seeding Netflix titles database:", error);
    }
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
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Page is not available" });
  }
});

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

app.get("/netflixTitles", async (req, res) => {
  try {
    const { page = 1, pageSize = 20, title, country, releaseYear } = req.query;
    const pageInt = parseInt(page);
    const pageSizeInt = parseInt(pageSize);

    let query = {};

    if (title) {
      query.title = { $regex: new RegExp(title, "i") };
    }
    if (country) {
      query.country = { $regex: new RegExp(country, "i") };
    }
    if (releaseYear) {
      query.release_year = parseInt(releaseYear);
    }

    const total = await NetflixTitle.countDocuments(query);
    const data = await NetflixTitle.find(query)
      .skip((pageInt - 1) * pageSizeInt)
      .limit(pageSizeInt);

    res.json({
      total,
      page: pageInt,
      pageSize: pageSizeInt,
      data,
    });
  } catch (error) {
    console.error("ERROR", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/netflixTitles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const title = await NetflixTitle.findById(id);

    if (title) {
      res.json(title);
    } else {
      res.status(404).json({ error: "Title not found" });
    }
  } catch (error) {
    console.error("Error fetching title:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

