import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import endpoints from "express-list-endpoints"

import netflixData from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo-api";
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

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable" })
  }
})


const Movie = mongoose.model('Movie', {
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
  description: String,
  type: String
})

if (process.env.RESET_DB) {
	const seedDatabase = async () => {
    await Movie.deleteMany({})

		netflixData.forEach((movie) => {
			new Movie(movie).save()
		})
  }

  seedDatabase()
}

const pages = (data, pageNumber = 1, res) => {
  const pageSize = 50
  const startIndex = (pageNumber - 1) * pageSize
  const endIndex = startIndex + pageSize
  const itemsOnPage = data.slice(startIndex, endIndex)
  const totalOfPages = Math.ceil(data.length / pageSize)

  if (pageNumber < 1 || pageNumber > totalOfPages && data.length > 0) {
    res.status(400)
      .json({
        success: false,
        status_code: 400,
        message: `Bad request: this page doesn't exist, page ${totalOfPages} is the last one.`
      })
  } else {
    const returnObject = {
      page: pageNumber,
      page_size: pageSize,
      items_on_page: itemsOnPage.length,
      total_of_pages: totalOfPages,
      total_of_results: data.length,
      success: true,
      results: itemsOnPage
    }

    return returnObject
  }
}
// Start page with all routes specified
app.get("/", (req, res) => {
  res.send(
    {
      "Welcome": "MovieFlix lets you search for movies, ratings and more. Have fun!",
      "Routes (can all be combined with query parameter: page=page": {
        "/": "Endpoints and descriptions",
        "/endpoints": "All endpoints",
      }
    }
  )
})

app.get("/movies", async (req, res) => {
  const { page } = req.query

  try {
    const requestKeysArray = Object.keys(req.query)
    const searchCriteriaObject = {}
    requestKeysArray.map(singleKey => {
      if (singleKey != "page") {
        searchCriteriaObject[singleKey] = req.query[singleKey]
      }
    })

    const allMovies = await Movie.find(searchCriteriaObject)

    res.status(200).json(pages(allMovies, page, res))

  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request."
    })
  }
})

app.get("/endpoints", (req, res) => {
  res.send(endpoints(app))
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
