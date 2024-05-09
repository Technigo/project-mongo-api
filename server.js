import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
import avocadoSalesData from "./data/avocado-sales.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/avocado";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const MagicItem = mongoose.model("MagicItem", {
  name: String,
  age: Number,
  isFurry: Boolean,
});

MagicItem.deleteMany().then(() => {
  new MagicItem({ name: "Alfons", age: 2, isFurry: true }).save();
  new MagicItem({ name: "Sture", age: 4, isFurry: false }).save();
});

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  // const endpoints = expressListEndpoints(app);
  // res.json(endpoints);
  MagicItem.find().then((items) => {
    res.json(items);
  });
});

app.get("/:name", (req, res) => {
  MagicItem.findOne({ name: req.params.name }).then((item) => {
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// // Avocado Tree
// app.get("/avocado", (req, res) => {
//   let filterList = [...avocadoSalesData];

//   // Query for a specific region
//   const regionSearch = req.query.region;
//   if (regionSearch) {
//     filterList = filterList.filter((item) =>
//       item.region.toLowerCase().includes(regionSearch.toLowerCase())
//     );
//   }

//   // Query to filter out all entries at a price point higher than the query.
//   const priceSearch = req.query.lowestprice;
//   if (priceSearch) {
//     filterList = filterList.filter((item) => item.averagePrice >= +priceSearch);
//   }

//   if (filterList.length > 0) {
//     res.json(filterList);
//   } else {
//     res.status(404).send("No datapoint found!");
//   }
// });

// app.get("/avocado/:avocadoId", (req, res) => {
//   const { avocadoId } = req.params;
//   const item = avocadoSalesData.find((findItem) => +avocadoId === findItem.id);

//   if (item) {
//     res.send(item);
//   } else {
//     res.status(404).send("No avocado found with that Id!");
//   }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });
