import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import netflixData from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
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
app.get("/", (req, res) => {
  Content.find().then((item) => {
    res.json(item);
  });
});

app.get("/year/:year", async (req, res) => {
  const search_year = req.params.year;
  const findYear = await Content.find({ release_year: search_year });
  res.json(findYear);
});

app.get("/type/:type", async (req, res) => {
  const search_type = req.params.type;
  const findType = await Content.find({ type: search_type });
  res.json(findType);
});

app.get("/titles/:id", async (req, res) => {
  const title = await Content.findById(req.params.id);
  res.json(title);
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
