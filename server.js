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
  Book.find().then(books => {
    res.json(books)
  })
  /* res.send('Hello world') */
})

app.get('/:title', (req, res) => {
  Book.findOne({ title: req.params.title }).then(book => {
    if (book) {
      res.json(book)
    } else {
      res.status(404).json({ error: 'Page not found' })
    }
  })
})

/* app.get('/:authors', (req, res) => {
  Book.findOne({ authors: req.params.authors }).then(book => {
    if (book) {
      res.json(book)
    } else {
      res.status(404).json({ error: 'Page not found' })
    }
  })
})

app.get('/:bookID', (req, res) => {
  Book.findOne({ bookID: req.params.bookID }).then(book => {
    if (book) {
      res.json(book)
    } else {
      res.status(404).json({ error: 'Page not found' })
    }
  })
}) */

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
