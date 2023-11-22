import express from "express";
import cors from "cors";
import mongoose from "mongoose";

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

//Set the model
const MensItem = mongoose.model("MensItem", {
  name: String,
  price: Number,
  currency: String,
  color: String,
  size: Array,
  quantity_sold: Number,
  quantity_in_stock: Number,
});

MensItem.deleteMany().then(() => {
  new MensItem({
    name: "ULTRA LIGHT DOWN VEST",
    price: 499.99,
    currency: "SEK",
    color: "Blue",
    size: ["S", "M", "L", "XL"],
    quantity_sold: 30,
    quantity_in_stock: 20,
  }).save();
});

// Start defining your routes here
app.get("/", (req, res) => {
  MensItem.find().then((item) => {
    res.json(item);
  });
});

//

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
