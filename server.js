import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

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
    await Book.deleteMany({})

    booksData.forEach(bookData => {
      new Book(bookData).save()
    })
  }

  seedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8088
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// Route for all books
app.get('/books', async (req, res) => {
  const { page } = req.query
  let booksList = await Book.find()

  const startIndex = 10 * (+page - 1) || 0
  const endIndex = startIndex + 10
  const booksListPaginated = booksList.slice(startIndex, endIndex)

  res.json({ books: booksListPaginated })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
