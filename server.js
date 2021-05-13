import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const movieSchema = new mongoose.Schema({
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

const Movie = mongoose.model('Movie', movieSchema)

// Function to start seeding our Database
// will only run if RESET_DB environment variable is present and is true
if (process.env.RESET_DB) {
  const seedDB = async () => {
    // Starts by deleting any pre-existing Movie objects to prevent duplicates when running database
    await Movie.deleteMany()

    netflixData.forEach(async (show) => {
      const newMovie = new Movie(show)
      await newMovie.save()
    })
  }
  seedDB()
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// OK 
// QA: Where do we add await? 
// Routes only /movies and endpont the logic? 
// Is this a good way to do more query params? 
// How to add more in the same search? 
app.get('/movies', async (req, res) => {
  const { country, year, show } = req.query 

  // delete all the id's from json and only show mongooose id
  await Movie.updateMany(
    { }, 
    { 
      $unset: { show_id: "" }
    }
  )

  if (country) {
    const movies = await Movie.find({ 
      country: {
        $regex: new RegExp(country, "i")
      }
    }) 
    res.json({ length: movies.length, data: movies })
  } else if (year) {
    const movies = await Movie.find({ release_year: year })  
    res.json({ length: movies.length, data: movies })
  } else if (show) { // fix it so it also shows tv
    const movies = await Movie.find({ $or: [{ type: "Movie" }, { type: "TV-show" }] })
    res.json({ length: movies.length, data: movies })
  } else {
    const movies = await Movie.find()
    res.json({ length: movies.length, data: movies })
  }
})

// OK 
// Is this good way to do routes or should I do /movies/titles? 
app.get('/titles', async (req, res) => {
  const title = await Movie.aggregate([
    { $sort: { title: 1 } },
    { $unset: ["_id", "director", "cast", "country", "date_added", "release_year", "rating", "duration", "listed_in", "description", "type", "__v"] }
  ])
  res.json({ length: title.length, data: title })

  /* 
   ****** Filtering and could only find titles but not sort. Solved it with aggregate ******
    const title = await Movie.find({}, { title: 1, _id: 0 })
    res.json({ length: title.length, data: title })

    ****** Without map and all the titles apply ******
    const filterTitles = title.map((item) => item.title)
    res.json({ length: filterTitles.length, data: filterTitles.sort() })  
  */
})

// OK 
// How can I split for each word and then push in to the new array? 
app.get('/genres', async (req, res) => {
  const genre = await Movie.find()
  const filterGenres = genre.map((item) => item.listed_in)
  const test = filterGenres.toString().split(" ")
  console.log(test) 
  let genresUnique = []
  
  filterGenres.forEach((item) => {
    if (!genresUnique.includes(item)) {
      genresUnique.push(item)
    }  
  })
  res.json({ length: genresUnique.length, data: genresUnique })
})

// OK 
app.get('/years', async (req, res) => {
  const year = await Movie.find()
  const filterYear = year.map((item) => item.release_year)
  let yearUnique = []

  filterYear.forEach((item) => {
    if (!yearUnique.includes(item)) {
      yearUnique.push(item)
    }
    return yearUnique.sort().reverse()
  })

  res.json({ length: yearUnique.length, data: yearUnique })
})

// OK
// Shows from only 2018 and up with operator and projection on what to show 
app.get('/movies/latest', async (req, res) => {
  const genre = await Movie.find(
    { release_year: 
      { 
        $gte: 2018 
      } }, 
    { 
      release_year: 1, title: 1, cast: 1 
    }
  )
 
  res.json({ length: genre.length, data: genre })
})

// Is 404 ok for ID because it is uniq and not found? Or should this also be 400? 
app.get('/movies/:movieId', async (req, res) => {  
  const { movieId } = req.params

  try {
    const movie = await Movie.findById(movieId)
    res.json({ data: movie })
  } catch (error) {
    res.status(404).json({ error: 'Not found!', details: error })
  }
})

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
