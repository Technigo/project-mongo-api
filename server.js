import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
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

//Set the model
const MensItem = mongoose.model("MensItem", {
  name: String,
  category: String,
  price: Number,
  currency: String,
  color: String,
  size: Array,
  quantity_sold: Number,
  quantity_in_stock: Number,
  isPromotion: Boolean,
});

MensItem.deleteMany().then(() => {
  new MensItem({
    name: "ULTRA LIGHT DOWN VEST",
    category: "coats_and_jackets",
    price: 499.99,
    currency: "SEK",
    color: "Blue",
    size: ["S", "M", "L", "XL"],
    quantity_sold: 30,
    quantity_in_stock: 20,
    isPromotion: true,
  }).save();

  new MensItem({
    name: "seamless down 3d cut parka",
    category: "coats_and_jackets",
    price: 899.99,
    currency: "SEK",
    color: "Black",
    size: ["M", "L", "XL"],
    quantity_sold: 15,
    quantity_in_stock: 10,
    isPromotion: false,
  }).save();
});

// Start defining your routes here
app.get("/", async (req, res) => {
  MensItem.find().then((item) => {
    res.json(item);
  });
});

//Get info by catagories
app.get("/:category", async (req, res) => {
  MensItem.find({ category: req.params.category }).then((item) => {
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: "Item Not found" });
    }
  });
});

//Get the items which are on promotion
app.get("/promotions", async (req, res) => {
  MensItem.find({ isPromotion: false })
    .then((item) => {
      res.json(item);
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
