import express from "express";
import expressListEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
import avocadoSalesData from "./data/avocado-sales.json";
import magicItemData from "./data/magic-items.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/avocado";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const MagicItem = mongoose.model("MagicItem", {
  name: String,
  price: Number,
  instock: Boolean,
  quantity: Number,
  color: String,
});

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await MagicItem.deleteMany({});

    magicItemData.forEach((itemData) => {
      new MagicItem(itemData).save;
    });
  };

  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

// MagicItem Tree
app.get("/magic-items", (req, res) => {
  let filterList = [...magicItemData];

  // Query for a specific color
  const colorSearch = req.query.color;
  if (colorSearch) {
    filterList = filterList.filter((item) =>
      item.color.toLowerCase().includes(colorSearch.toLowerCase())
    );
  }
  // Query to filter out all entries at a price point lower than the query.
  const priceSearch = req.query.price;
  if (priceSearch) {
    filterList = filterList.filter((item) => item.price <= +priceSearch);
  }

  if (filterList.length > 0) {
    res.json(filterList);
  } else {
    res.status(404).send("No datapoint found!");
  }
});

app.get("/magic-items/:itemId", (req, res) => {
  const { itemId } = req.params;
  const item = magicItemData.find((findItem) => +itemId === findItem.id);

  if (item) {
    res.send(item);
  } else {
    res.status(404).send("No magical item found with that Id!");
  }
});

app.get("/magic-items/:id", async (req, res) => {
  try {
    const item = await MagicItem.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (err) {
    res.status(404).send("No magical item found with that Id!");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
