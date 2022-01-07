/* eslint-disable comma-dangle */
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
import avocadoSalesData from "./data/avocado-sales.json";
// import res from "express/lib/response";
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const Sales = mongoose.model("Sales", {
  id: Number,
  date: String,
  averagePrice: Number,
  totalVolume: Number,
  totalBagsSold: Number,
  smallBagsSold: Number,
  largeBagsSold: Number,
  xLargeBagsSold: Number,
  region: String,
});

if (!process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Sales.deleteMany({});

    avocadoSalesData.forEach((item) => {
      const newSales = new Sales(item);
      newSales.save();
    });
  };

  seedDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/sales", async (req, res) => {
  const sales = await Sales.find({});
  res.json(sales);
});

app.get("/sales/id/:id", async (req, res) => {
  try {
    const salesId = await Sales.findById(req.params.id);
    if (salesId) {
      res.json(salesId);
    } else {
      res.status(404).json({ error: "sales not found" });
    }
  } catch (err) {
    res.status(400).json({ error: "Id is invalid" });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
