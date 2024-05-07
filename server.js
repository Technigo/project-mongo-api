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
  console.log("database");
};

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// API route
app.get("/", (req, res) => {
  res.send("Welcome to the Avocado Sales API!");
});

app.get("/", async (req, res) => {
  const avocados = await Avocado.find();
  res.json(avocados);
});

app.get("/avocados/:id", async (req, res) => {
  const avocado = await Avocado.findOne({ id: parceInt(req.params.id) });
  if (avocado) {
    res.json(avocado);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

// Start the server
app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  await seedDatabase;
});
