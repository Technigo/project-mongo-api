import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/books'
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
app.use(express.json())

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
  text_reviews_count: Number,
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({})

    booksData.forEach((item) => {
      new Book(item).save()
    })
  }

  seedDatabase()
}

// Lists all endpoints
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

//Query param to get book by title: /books?title=enter the title
//Query param to get book by author: /books?authors=enter the author
app.get('/books', async (req, res) => {
  const { title, authors } = req.query

  try {
    const allBooks = await Book.find({
      title: new RegExp(title, 'i'),
      authors: new RegExp(authors, 'i'),
    })
    res.json(allBooks)
  } catch (error) {
    res.status(400).json({
      error: 'Cannot find',
    })
  }
})

//Endpoint to get a single book by id
app.get('/books/:id', async (req, res) => {
  const { id } = req.params

  const bookById = await Book.findOne({ bookID: id })

  if (!bookById) {
    res.status(404).json('No books with that ID found..')
  } else {
    res.status(200).json(bookById)
  }
})

//Endpoint to get all books with less than 350 pages
app.get('/books/pages/shortbooks', async (req, res) => {
  try {
    const shortBooks = await Book.find({ num_pages: { $lt: 350 } })
    res.json(shortBooks)
  } catch (error) {
    res.status(400).json({
      error: 'Cannot find',
    })
  }
})

//Endpoint to get all books books with pages between 350 to 800
app.get('/books/pages/mediumbooks', async (req, res) => {
  try {
    const mediumBooks = await Book.find({
      $and: [{ num_pages: { $gt: 350 } }, { num_pages: { $lt: 800 } }],
    })
    res.json(mediumBooks)
  } catch (error) {
    res.status(400).json({
      error: 'Cannot find',
    })
  }
})

//Endpoint to get all books greater than and equal to 800 pages
app.get('/books/pages/longbooks', async (req, res) => {
  try {
    const longBooks = await Book.find({ num_pages: { $gte: 800 } })
    res.json(longBooks)
  } catch (error) {
    res.status(400).json({
      error: 'Cannot find',
    })
  }
})

//Endpoint for all books with a rating less than 2.5
app.get('/books/ratings/lowrating', async (req, res) => {
  try {
    const lowRating = await Book.find({ average_rating: { $lt: 2.5 } })
    res.json(lowRating)
  } catch (error) {
    res.status(400).json({
      error: 'Cannot find',
    })
  }
})

//Endpoint for all books with a rating between 2.5 and 3.8
app.get('/books/ratings/mediumrating', async (req, res) => {
  try {
    const mediumRating = await Book.find({
      $and: [
        { average_rating: { $gte: 2.5 } },
        { average_rating: { $lt: 3.7 } },
      ],
    })
    res.json(mediumRating)
  } catch (error) {
    res.status(400).json({
      error: 'Cannot find',
    })
  }
})

//Endpoint for all books with a rating greater than 3.8
app.get('/books/ratings/highrating', async (req, res) => {
  try {
    const highRating = await Book.find({ average_rating: { $gte: 3.7 } })
    res.json(highRating)
  } catch (error) {
    res.status(400).json({
      error: 'Cannot find',
    })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
