import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const avocadoSchema = new mongoose.Schema({
  id: Number,
  date: String,
  averagePrice: Number,
  totalVolume: Number,
  totalBagSold: Number,
  smallBagsSold: Number,
  largeBagsSold: Number,
  xLargeBagsSold: Number,
  region: String,
});
const Avocado = mongoose.model("Avocado", avocadoSchema);

const seedDatabase = async () => {
  await Avocado.deleteMany({});
  avocadoSalesData.forEach(async (entry) => {
    await new Avocado(entry).save();
  });
  console.log("database")
};

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Welcome to the Avocado Sales API!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
