import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import beerData from "./data/beer-styleguide-2015.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-mongo-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints');

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const { Schema } = mongoose;

const beerSchema = new Schema ({
  id: String,
  name: String,
  style: String,
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

const Beer = mongoose.model("Beer", beerSchema)


if(process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Beer.deleteMany();
   beerData.forEach((beer) => {
      new Beer(beer).save()
    })

  }
  seedDatabase()
}

// Routes
app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "OK",
    body: {
      content: "Hello and welcome to the beers!",
      endpoints: listEndpoints(app)
    }
  })
})

// Endpoint for all the beers, paginated
app.get("/beers", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1 // Get the requested page number from the query parameters (default: 1)
    const perPage = parseInt(req.query.perPage) || 5 // Get the number of items per page from the query parameters (default: 5)
    const skip = (page - 1) * perPage; // Calculate the number of items to skip

    const beers = await Beer.aggregate([
      { $sort: { style: 1, _id: 1 } },
      { $skip: skip },
      { $limit: perPage },
    ])

    res.status(200).json({
      success: true,
      body: beers,
    })
  } catch (err) {
    res.status(404).json({
      success: false,
      body: {
        message: "Something went wrong!",
      },
    })
  }
})


// //Endpoint for beer types
// app.get("/beers/:beerType", async (req, res) => {
//   const {beerType} = req.query
//   const matchingRegex = new RegExp{beerType};
//   const foundBeerType = Beer.findAll({name: matchingRegEx})
//   if (foundBeerType) {
//     res.status(200).json({success: true, response: foundBeerType})
//   } else {
//     fetch(``)
//     .then((response) => response.json())
//     .then(async (data) => 7
//     const newBeer)
//   }
// })

//Endpoint for single beer by id
app.get("/beers/:id", async (req, res) => {
  try {
    const singleBeer = await Beer.findById(req.params.id)
    if (singleBeer) {
      res.status(200).json({
        success: true,
        body: singleBeer
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find the beer!"
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
