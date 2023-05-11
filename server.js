import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import netflixData from './data/netflix-titles.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. 
const port = process.env.PORT || 8080
const app = express()
const listEndpoints = require(("express-list-endpoints"))

app.use(cors())
app.use(express.json())

const { Schema } = mongoose

// const userSchema = new Schema({
//   name: String,
//   age: Number,
//   alive: Boolean
// })
// const User = mongoose.model('User', userSchema)

const titleSchema = new Schema({
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
const Title = mongoose.model("Title", titleSchema)
const Type = mongoose.model("Type", titleSchema)

if (process.env.RESET_DATABASE) {
  const resetDataBase = async () => {
    await Title.deleteMany()
    netflixData.forEach((singleTitle) => {
      const newTitle = new Title(singleTitle)
      newTitle.save()
    })
  }
  // call a function while declaring it
  resetDataBase()
}
// Routes
app.get("/", (req, res) => {
  res.json(listEndpoints(app))
  // res.send("Mongoose Bonanza!!!!!")
})

app.get("/titles", async (req, res) => {
  const allTitles = await Title.find()
  res.json(allTitles)
})

app.get("/country/:country", async (req, res) => {
  const { country } = req.params;
  const response = {
    success: true,
    body: {},
  };
  const countryRegex = new RegExp(country, "i");

  try {
    const searchResultFromDB = await Title.find({ country: countryRegex });
    if (searchResultFromDB.length > 0) {
      response.body = searchResultFromDB;
      res.status(200).json(response)
    } else {
      response.success = false
      res.status(404).json(response)
    }
  } catch (error) {
    response.success = false;
    res.status(500).json(response)
  }
})

app.get("/type/:category", async (req, res) => {
  const { category } = req.params
  const response = {
    success: true,
    body: {}
  };

  try {
    let titles = []

    if (category === "tvshow") {
      titles = await Title.find({ type: "TV Show" })
    } else if (category === "movies") {
      titles = await Title.find({ type: "Movie" })
    } else {
      response.success = false
      response.body.message = "Invalid category"
      return res.status(400).json(response);
    }

    if (titles.length > 0) {
      response.body = titles
      res.status(200).json(response)
    } else {
      response.success = false
      res.status(404).json(response)
    }
  } catch (error) {
    response.success = false
    response.body.message = error.message
    res.status(500).json(response)
  }
})

// app.get("/movies", async (req, res) => {
//   try {
//     const movies = await Title.find({ type: "Movie" })
//     if (movies.length > 0) {
//       res.status(200).json({
//         success: true,
//         body: movies
//       })
//     } else {
//       res.status(404).json({
//         success: false,
//         body: {
//           message: 'No movies found'
//         }
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       body: {
//         message: 'Internal server error.'
//       }
//     })
//   }
// })

app.get("/titles/id/:id", async (req, res) => {
  try {
    const singleTitle = await Title.findOne({ show_id: req.params.id })
    if (singleTitle) {
      res.status(200).json({
        success: true,
        body: singleTitle
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: 'Title not found'
        }
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      body: {
        message: error
      }
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})
