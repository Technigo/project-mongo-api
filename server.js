import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'
import { stringify } from 'nodemon/lib/utils'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. 
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// The Model
const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

// Populate the database and make it run
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({}) //async await method to make sure that the data doesn't get duplicated

    // Looping through the array of booksData and
    // for each object (item), a new book is created with the data that is inside of each object 
    booksData.forEach(item => {
      const newBook = new Book(item)
      newBook.save()
    })
  }

  seedDatabase()
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world! This is an API with book data')
})

// Endpoint listing all data - booksData
app.get('/books', (req, res) => {
  Book.find().then(books => {
    res.json(books)
  })
})

// Endpoint for when searching on a specific book title
app.get('/books-title/:title', (req, res) => {
  Book.findOne({ title: req.params.title }).then(book => {
    if (book) {
      res.json(book)
    } else {
      res.status(404).json({ error: 'No book with that title was found' })
    }
  })
})

// Endpoint for a specific book searching on the bookID
app.get('/books-id/:id', async (req, res) => {
  const book = await Book.findOne({ bookID: req.params.id })
  if (book) {
    res.json(book)
  } else {
    res.status(404).json({ error: 'No book with that ID was found' })
  }
})

// Endpoint for when searching on a specific author
app.get('/books-authors/:authors', async (req, res) => {
  const book = await Book.findOne({ authors: req.params.authors })
  if (book) {
    res.json(book)
  } else {
    res.status(404).json({ error: 'No book by that author was found' })
  }
})



// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
