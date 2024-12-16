import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();


const rawData = fs.readFileSync("./data/netflix-titles.json");
const netflixData = JSON.parse(rawData);

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/netflix_titles";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const NetflixTitle = mongoose.model(
  "NetflixTitle", // Modellnamn
  {
    show_id: Number,
    title: String,
    country: String,
    release_year: Number,
    rating: String,
    description: String,
  },
  "netflixtitles" // Explicit collection-namn
);


if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    console.log("🌱 Seeding the database...");
    await NetflixTitle.deleteMany(); // Rensa collectionen innan ny data läggs till
    await NetflixTitle.insertMany(
      netflixData.map((item) => ({
        show_id: item.show_id,
        title: item.title,
        director: item.director,
        cast: item.cast,
        country: item.country,
        date_added: item.date_added,
        release_year: item.release_year,
        rating: item.rating,
        duration: item.duration,
        listed_in: item.listed_in,
        description: item.description,
        type: item.type,
      }))
    );
    console.log("✅ Database seeded!");
  };
  seedDatabase();
}
// Routes
import listEndpoints from "express-list-endpoints";

// API Documentation Route
app.get("/", (req, res) => {
  const documentation = {
    welcome: "Welcome to the Netflix Titles API!",
    description: "This API provides access to a collection of Netflix titles.",
    endpoints: listEndpoints(app).map((endpoint) => ({
      path: endpoint.path,
      methods: endpoint.methods,
    })),
    queryParameters: {
      "/netflix_titles": {
        sorted: "Sort titles by rating (true/false)",
        country: "Filter by country (case-insensitive)",
        release_year: "Filter by release year",
      },
    },
  };
  res.json(documentation);
});

// Get all Netflix titles with optional filters and pretty-print
app.get("/netflix_titles", async (req, res) => {
  const { sorted, country, release_year } = req.query;

  const query = {};
  if (country) {
    query.country = { $regex: country, $options: "i" }; // Case-insensitive search
  }
  if (release_year) {
    query.release_year = Number(release_year);
  }

  try {
    let titles = await NetflixTitle.find(query);
    if (sorted) {
      titles = titles.sort((a, b) => b.rating - a.rating); // Sort by rating
    }

    // Set header and send indented JSON
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(titles, null, 2));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


// Get a single Netflix title by show_id
app.get("/netflix_titles/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const title = await NetflixTitle.findOne({ show_id: Number(id) });
    if (title) {
      res.json(title);
    } else {
      res.status(404).json({ error: "Title not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
