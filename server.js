import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import movieData from './data/imdb-movie-data.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/movies"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// {
//   "Rank": 815,
//   "Title": "Fantastic Mr. Fox",
//   "Genre": "Animation,Adventure,Comedy",
//   "Description": "An urbane fox cannot resist returning to his farm raiding ways and then must help his community survive the farmers' retaliation.",
//   "Director": "Wes Anderson",
//   "Actors": "George Clooney, Meryl Streep, Bill Murray, Jason Schwartzman",
//   "Year": 2009,
//   "Runtime (Minutes)": 87,
//   "Rating": 7.8,
//   "Votes": 149779,
//   "Revenue (Millions)": 21,
//   "Metascore": 83
// },


const Movie = mongoose.model('Movie', {
    Rank: {
      type: String
    },
    Title: {
      type: String
    },
    Genre: {
      type: String
    },
    Description: {
      type: String
    },
    Director: {
      type: String
    },
    Actors: {
      type: String
    },
    Year: {
      type: Number
    },
    Runtime: {
      type: Number
    },
    Rating: {
      type: Number
    },
    // Revenue: {
    //   type: Number
    // },
    Metascore: {
      type: Number
    }
})

const importMovieData = async() => {
  await Movie.deleteMany()

  movieData.forEach((movie) => {
    new Movie(movie).save();
  })
}

importMovieData()

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello movies')
})

app.get('/movies', (req, res) => {
  
      res.json(movieData)
})

app.get('/movies/:title', (req, res) => {
  const title = req.params.title;
  Movie.findOne({'Title': title})
    .then((results) => {
      res.json(results);
    }).catch((err) => {
      res.json({message: 'Cannot find this movie', err: err});
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
