import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Mensitems, MensItemsModel } from "./backend/models/MensItem";
// import mensWearData from "./data/mens_wear.json";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

dotenv.config(); // Load environment variables from the .env file
const router = express.Router();
const listEndpoints = require("express-list-endpoints");
// Added this line because of the warning "DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7"
mongoose.set("strictQuery", false);
const mongoUrl =
  "mongodb+srv://jjanicecheng:8qytRGt7TaFQao9b@jforjanice.kdzt34w.mongodb.net/?retryWrites=true&w=majority"; // process.env.MONGO_URL || "mongodb://localhost/project-mongo";
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

// MensItemsModel.deleteMany().then(() => {
//   MensItemsModel.insertMany(mensWearData);
// });

// List of endpoints
app.get("/", async (req, res) => {
  res.send(listEndpoints(app));
});

//Get all items
app.get("/items", async (req, res) => {
  try {
    const allItems = await MensItemsModel.find();
    res.json(allItems);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Get one item
app.get("/items/:id", async (req, res) => {
  try {
    const item = await MensItemsModel.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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
app.get("/size/", async (req, res) => {
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
//i.e /category/coats_and_jackets should get all items available in Size S
app.get("/category/:category", async (req, res) => {
  const items = await MensItemsModel.find({ category: req.params.category });
  if (items) {
    res.json(items);
  } else {
    res.status(404).json({ error: "Item Not found" });
  }
});

//Add item
app.post("/items", async (req, res) => {
  try {
    const createdItem = await MensItemsModel.create(req.body);
    res.status(201).set("Location", `/items/${createdItem._id}`).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Delete item
app.delete("/items/:id", async (req, res) => {
  try {
    const result = await MensItemsModel.deleteOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    //When the item has been successfully deleted, it will retrun 204
    //If the user send in delete request again after the item was deleted, it will return otherwise 404.
    res.status(result.deletedCount ? 204 : 404).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
