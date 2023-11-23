import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { MensItemsModel } from "./backend/models/MensItem";
dotenv.config(); // Load environment variables from the .env file

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";
import mensWearData from "./data/mens_wear.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

MensItemsModel.deleteMany().then(() => {
  MensItemsModel.insertMany(mensWearData);
});

// Fetch the whole set of data
app.get("/", async (req, res) => {
  MensItemsModel.find().then((items) => {
    res.json(items);
  });
});

//Get the items which are on promotion
app.get("/promotions", async (req, res) => {
  const items = await MensItemsModel.find({ isPromotion: true });
  res.json(items);
});

//Get the items which are on promotion & sort them by the best selling item
app.get("/promotions/bestSelling", async (req, res) => {
  const items = await MensItemsModel.find({ isPromotion: true }).sort({
    quantity_sold: -1,
  });
  res.json(items);
});

//Get the items according to the size
//Use "$all" operator together with "find ()" method to find matching value in an array
//If an item only has one of the specified sizes, it won't be included in the result.
//Note: If we want to return size which mactch either one, we can use $in operator
//i.e /size?sizes=S should get all items available in Size S
//i.e /size?sizes=S,XL will return items that are available in both sizes 'S' and 'XL'

app.get("/size", async (req, res) => {
  const sizes = req.query.sizes;
  // assuming the user provides sizes as a comma-separated list in the query parameter
  const sizesArray = sizes.split(",");
  if (!sizes) {
    return res
      .status(400)
      .json({ error: "Please provide the size you would like" });
  }

  const items = await MensItemsModel.find({
    size: { $all: sizesArray },
  });

  res.json(items);
});

//Get items by catagories
app.get("/category/:category", async (req, res) => {
  const items = await MensItemsModel.find({ category: req.params.category });
  if (items) {
    res.json(items);
  } else {
    res.status(404).json({ error: "Item Not found" });
  }
});

//Get

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
