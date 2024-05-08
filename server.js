import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import City from "./models/City";
import expressListEndpoints from "express-list-endpoints";
import topCitiesChina from "./data/china-city.json";
import {
  errorHandler,
  methodController,
  queryParamContoller,
} from "./middleware/Middleware";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// RESET data when necessary
if (process.env.RESET_DB) {
  const seedDirectorDatabase = async () => {
    await City.deleteMany();
    topCitiesChina.forEach(city => {
      console.log(city);
      new City(city).save();
    });
  };
  seedDirectorDatabase();
}

// Defines the port the app will run on.
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Add middleware to limit the request method to GET
app.use(methodController);

// Start defining your routes here
app.get("/", queryParamContoller, (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

// Display all the cities
app.get("/cities", async (req, res) => {
  const { page, sort, order } = req.query;
  const cities = await City.find()
    .sort(
      sort
        ? { sort: order === "descending" ? -1 : 1 }
        : { city: 1, province: 1 }
    )
    .limit(page ? +page * 20 : 20);
  res.json(cities);
});

// Display a city by id
app.get("/cities/:id", queryParamContoller, async (req, res) => {
  const city = await City.findById(req.params.id);
  res.json(city);
});

//Display provinces
app.get("/provinces", queryParamContoller, async (req, res) => {
  const provinces = await City.aggregate([
    {
      $group: {
        _id: "$province",
        cities: {
          $addToSet: "$city",
        },
        cityCount: {
          $sum: 1,
        },
        population: {
          $sum: "$population",
        },
        province_size: {
          $sum: "$area_size",
        },
        avgPopulationDensity: {
          $avg: {
            $divide: ["$population", "$area_size"],
          },
        },
      },
    },
    {
      $sort: {
        population: -1,
      },
    },
  ]);
  res.json(provinces);
});

// Display a summary of a province
app.get("/provinces/:name", queryParamContoller, async (req, res) => {
  const cities = await City.aggregate([
    {
      $match: {
        // make param case insensitive
        province: { $regex: req.params.name, $options: "i" },
      },
    },
    {
      $group: {
        _id: "$province",
        cities: {
          $addToSet: "$city",
        },
        cityCount: {
          $sum: 1,
        },
        population: {
          $sum: "$population",
        },
        province_size: {
          $sum: "$area_size",
        },
        populationDensity: {
          $avg: {
            $divide: ["$population", "$area_size"],
          },
        },
      },
    },
  ]);
  res.json(cities);
});

//any other endpoints with GET method that are not acceptable -> 404 error
app.use((req, res, next) => {
  const err = new Error(`Cannot find endpoint: ${req.originalUrl}.`);
  err.statusCode = 404;
  next(err);
});
// Add middleware to handle the global error coming from any of the endpoints
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
