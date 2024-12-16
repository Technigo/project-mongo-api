import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// Läs in JSON-data med felhantering
let netflixData = [];
try {
  const rawData = fs.readFileSync("./data/netflix-titles.json");
  netflixData = JSON.parse(rawData);
  console.log(`✅ Loaded ${netflixData.length} titles from JSON file.`);
} catch (error) {
  console.error("❌ Error reading or parsing JSON file:", error.message);
}

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/netflix_titles";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Kontrollera MongoDB-anslutning
mongoose.connection.on("connected", () => {
  console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`);
});
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

const port = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Definiera Mongoose-modell med alla fält från JSON-filen
const NetflixTitle = mongoose.model(
  "NetflixTitle",
  {
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
  },
  "netflixtitles" // Explicit namn på collection
);

// Seedningsfunktion för att lägga in data i databasen
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    console.log("🌱 Seeding the database...");

    try {
      const deleteResult = await NetflixTitle.deleteMany();
      console.log(`🗑️ Deleted ${deleteResult.deletedCount} existing documents.`);

      const insertedDocs = await NetflixTitle.insertMany(
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
      console.log(`✅ Successfully seeded ${insertedDocs.length} documents!`);
    } catch (error) {
      console.error("❌ Error seeding database:", error.message);
    }
  };
  seedDatabase();
}

// Routes
import listEndpoints from "express-list-endpoints";

// API Dokumentation
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

// Hämta alla Netflix-titlar med filter
app.get("/netflix_titles", async (req, res) => {
  const { sorted, country, release_year } = req.query;

  const query = {};
  if (country) {
    query.country = { $regex: country, $options: "i" };
  }
  if (release_year) {
    query.release_year = Number(release_year);
  }

  try {
    let titles = await NetflixTitle.find(query);
    if (sorted) {
      titles = titles.sort((a, b) => a.rating.localeCompare(b.rating));
    }

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(titles, null, 2));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Hämta en specifik Netflix-titel baserat på show_id
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

// Starta servern
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
