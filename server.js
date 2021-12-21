import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 9090
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  averageRating: Number,
  isbn: Number,
  isbn13: Number,
  languageCode: String,
  numPages: Number,
  ratingsCount: Number,
  textReviewsCount: Number
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({})

    booksData.forEach(item => {
      const newBook = new Book(item)
      newBook.save()
    })
  }
  seedDatabase()
}

// Our own middleware to see if the database is connected before going to our endpoints

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({
      error: 'Service unavailable',
      success: false
    })
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

//mongoose way of getting endpoints
//get all the books

app.get('/books', async (req, res) => {
  let books = await Book.find(req.query)

  // filter by query for pages per book, if greater than or equal to given number

  if (req.query.numPages) {
    const booksByPages = await Book.find().gt('numPages', req.query.numPages)
    books = booksByPages
  }

  // filter by rating

  if (req.query.averageRating) {
    const booksByRating = await Book.find().gt('averageRating', req.query.averageRating)
    books = booksByRating
  }

  // filter by ratings count

  if (req.query.ratingsCount) {
    const booksByRatingCount = await Book.find().gt('ratingsCount', req.query.ratingsCount)
    books = booksByRatingCount
  }


  res.json(books)
})

//get one book based on id

app.get('/books/:id', async (req, res) => {
  try {
    const bookById = await Book.findById(req.params.id)
    if (bookById) {
      res.json({
        response: bookById,
        success: true
      })
    } else {
      res.status(404).json({ 
        response: 'Book not found', 
        success: false 
      })
    }
  } catch(err) {
    res.status(400).json({
      response: 'Invalid request',
      success: false
    })
  }
})




// Authors endpoint

app.get('/books/authors', async (req, res) => {
  try {
    const bookByAuthors = await Book.distinct('authors')
    if (bookByAuthors) {
      res.json({
        response: bookByAuthors,
        success: true
      })
    } else {
      res.status(404).json({ 
        response: 'Authors not found', 
        success: false 
      })
    }
  } catch (err) {
    res.status(400).json({
      response: 'Invalid request',
      success: false
    })
  }
})


// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port} ~(^@_^)~`)
})
