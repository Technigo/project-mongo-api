import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import beerData from "./data/beer-styleguide-2015.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-mongo-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints')

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const { Schema } = mongoose;

const beerCategorySchema = new Schema ({
  id: String,
  name: String,
  type: String,
  impression: String,
  aroma: String,
  appearance: String,
  flavor: String,
  mouthfeel: String,
  comments: String,
  history: String,
  ingredients: String,
  examples: [String],
    ibu: {
      flexible: Boolean,
      low: Number,
      high: Number
    },
    abv: {
      flexible: Boolean,
      low: Number,
      high: Number
    }
})

const BeerCategory = mongoose.model("BeerCategory", beerCategorySchema)


if(process.env.RESET_DB) {
  const seedDatabase = async () => {
    await BeerCategory.deleteMany();
   beerData.forEach((beer) => {
      new BeerCategory(beer).save()
    })

  }
  seedDatabase()
}

// Routes
app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});


app.get("/beers", async (req, res) => {
  try {
    let beers;
    if (req.query.type) {
      beers = await BeerCategory.find({ type: req.query.type });
    } else {
      beers = await BeerCategory.find();
    }
    res.status(200).json({ success: true, body: beers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


app.get("/beers/:id", async (req, res) => {

  try {
    const singleBeer = await BeerCategory.findById(req.params.id)
    if (singleBeer) {
      res.status(200).json({
        success: true,
        body: singleBeer
        
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find the beer"
        }
      })
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid id"
      }
    })
  }

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
