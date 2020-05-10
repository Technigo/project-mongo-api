import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

// Database setup:
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Mongoose model setup:
  // Book Model
const Book = mongoose.model('Book', {
  bookID: {
    type: Number
  },
  title: {
    type: String
  },
  authors: {
    type: String
  },
  average_rating: {
    type: Number
  },
  isbn: {
    type: Number
  },
  isbn13: {
    type: Number
  },
  language_code: {
    type: String
  },
  num_pages: {
    type: Number
  },
  ratings_count: {
    type: Number
  },
  text_reviews_count: {
    type: Number
  }
})
/*
  isbn: {
    type: String,
    // unique: true
    // But give "Deprecation Warnings" in Node:
    // https://mongoosejs.com/docs/deprecations.html
  },
*/

// RESTART_DATABASE npm run dev:
// $ RESET_DATABASE=true npm run dev
// Seed DATABASE using Async
// forEach loop will put all Books from JSON into database
if (process.env.RESET_DATABASE){
 console.log('Resetting database')

  const seedDatabase = async () => {
    await Book.deleteMany()

    booksData.forEach((book) => {
      new Book(book).save()
    })
  }
 seedDatabase()
}

// Dubbelkolla detta oven först innan SEED till MongoDB
// se databas i Compass! project-mongo / books 
// project-mongo.books


// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world - Mongo API here! Get som books ready LALALA!')
})

 // find ALL Books
 // find ONE Book per NAME:







 
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
