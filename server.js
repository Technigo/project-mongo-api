import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// const Author = mongoose.model('Author', {
//   name: String
// })

// const bookSchema = new mongoose.Schema({
//   authors: String,
//   title: String,
//   language_code: String,
//   num_pages: Number,
//   average_rating: Number,
//   isbn: Number
// })

const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  // är isbn en string??
  // isbn: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

if (process.env.RESET_DB) {
  console.log('resetting database')

  const seedDatabase = async () => {
    await Book.deleteMany();
    booksData.forEach((book) => new Book(book).save())
  }
  seedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello')
})

// endpoint to get all books
app.get('/books', async (req, res) => {
  const books = await Book.find()
  res.json(books)
})

// endpoint to get a single book by id
app.get('/books/:id', async (req, res) => {
  const book = await Book.findById(req.params.id)
  if (book) {
    res.json(book)
  } else {
    res.status(404).json({ error: 'Book not found' })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
