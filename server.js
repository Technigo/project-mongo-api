import express from "express";
import cors from "cors";
import mongoose from "mongoose";
const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

import netflixData from "./data/netflix-titles.json";

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-movie-titles";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const Title = mongoose.model("Title", {
  show_id: Number,
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  type: String,
});

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Title.deleteMany({});
    netflixData.forEach((title) => {
      new Title(title).save();
    });
  };
  seedDatabase();
}

// Start defining your routes here
const paginate = (res, page, limit, titlesToSend) => {
  let pageInt = parseInt(page);
  let limitInt = parseInt(limit);
  const next = pageInt + 1;
  const previous = pageInt - 1;
  const startIndex = (pageInt - 1) * limitInt;
  const endIndex = pageInt * limitInt;
  const nrPages = Math.ceil(titlesToSend.length / limitInt);
  const titlesToSendPage = titlesToSend.slice(startIndex, endIndex);

  if (previous === 0) {
    res.status(200).json({
      next: next,
      response: titlesToSendPage,
      success: true,
    });
  } else if (endIndex < titlesToSend.length) {
    res.status(200).json({
      next: next,
      previous: previous,
      response: titlesToSendPage,
      success: true,
    });
  } else {
    res.status(200).json({
      previous: nrPages,
      response: titlesToSendPage,
      success: true,
    });
  }
};

// function that takes in path-param, checks if it can find it and returns a proper status and response. If there is a page and limit set, the function pagination is called. The plus-sign before a variable says to convert it from string to number
const checkPathParam = async (
  param,
  typeOfTitle,
  res,
  typeOfParam,
  page,
  limit
) => {
  let titlesWithParam = {};
  let errorResponse = "";
  if (typeOfParam === "id") {
    titlesWithParam = await Title.findOne({
      type: typeOfTitle,
      show_id: param,
    });
    errorResponse = `there is no ${typeOfTitle} with the id ${param}`;
  } else if (typeOfParam === "year") {
    titlesWithParam = await Title.find({
      type: typeOfTitle,
      release_year: +param,
    });
    errorResponse = `there are no ${typeOfTitle} from ${param}`;
  }

  // if there is no result, return 404. If page and limit exists, paginate the result.
  if (!titlesWithParam || titlesWithParam.length === 0) {
    res.status(404).json({
      response: errorResponse,
      success: false,
    });
  } else if (page && limit) {
    paginate(res, page, limit, titlesWithParam);
  } else {
    res.status(200).json({
      response: titlesWithParam,
      success: true,
    });
  }
};

app.get("/netflix-titles", async (req, res) => {
  const { year, country, page, limit } = req.query;
  let titlesToSend = {};

  // titlesToSend = await Title.find({
  //   release_year: year,
  //   country: country,
  // });

  if (year && !country) {
    console.log("year is active");
    titlesToSend = await Title.find({
      release_year: year,
    });
  } else if (year && country) {
    titlesToSend = await Title.find({
      release_year: year,
      country: country,
    });
  } else if (!year && country) {
    titlesToSend = await Title.find({
      country: country,
    });
  } else {
    titlesToSend = await Title.find({});
  }
  if (page && limit) {
    paginate(res, page, limit, titlesToSend);
  } else {
    res.status(200).json({
      response: titlesToSend,
      success: true,
    });
  }
});

app.get("/netflix-titles/movies", async (req, res) => {
  const { page, limit } = req.query;
  let titlesToSend = await Title.find({
    type: "movie",
  });
  if (page && limit) {
    paginate(res, page, limit, titlesToSend);
  } else {
    res.status(200).json({
      response: titlesToSend,
      success: true,
    });
  }
});

app.get("/netflix-titles/movies/:id", (req, res) => {
  const { id } = req.params;
  checkPathParam(id, "movie", res, "id");
});

app.get("/netflix-titles/movies/year/:year", (req, res) => {
  const { page, limit } = req.query;
  const year = req.params.year;
  checkPathParam(year, "movie", res, "year", page, limit);
});

app.get("/netflix-titles/tv-shows", async (req, res) => {
  const { page, limit } = req.query;
  let titlesToSend = await Title.find({
    type: "tv-show",
  });
  if (page && limit) {
    paginate(res, page, limit, titlesToSend);
  } else {
    res.status(200).json({
      response: titlesToSend,
      success: true,
    });
  }
});

app.get("/netflix-titles/tv-shows/:id", (req, res) => {
  const { id } = req.params;
  checkPathParam(id, "TV-show", res, "id");
});

app.get("/netflix-titles/tv-shows/year/:year", (req, res) => {
  const { page, limit } = req.query;
  const year = req.params.year;
  checkPathParam(year, "TV-show", res, "year", page, limit);
});

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("*", function (req, res) {
  res.status(404).json({
    response: "There is no such page",
    success: false,
  });
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
