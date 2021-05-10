import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

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
  isbn: String,
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
  res.send(listEndpoints(app))
})

// endpoint to get all books
app.get('/books', async (req, res) => {
  const books = await Book.find()
  res.json(books)
})

// endpoint to get a single book by id, obs id från compass, ej id från json
app.get('/books/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({ error: 'Invalid id' })
    return;
  }

  const book = await Book.findById(req.params.id)
  if (book) {
    res.json(book)
  } else {
    res.status(404).json({ error: 'Book not found' })
  }
})


// endpoint to get the 20 books with most textreviews, kommer från förra veckans kod
// app.get('/textreviews', (req, res) => {
//   const books = booksData.sort((a, b) => b.text_reviews_count - a.text_reviews_count);
//   res.json(books.slice(0, 20));
// })

app.get('/textreviews', async (req, res) => {
  let books = await Book.find()
  books = books.sort((a, b) => b.text_reviews_count - a.text_reviews_count);
  res.json(books.slice(0, 20));
})

// denna funkar inte
app.get('/author/:author', async (req, res) => {
  const { author } = req.params
  const queryRegex = new RegExp(author, 'i')
  const books = await Book.find({ authors: queryRegex })

  // let books = await Book.find();
  // books = books.filter((book) => book.authors.toLowerCase().includes(author.toLowerCase()))

  if (books.length) {
    res.json(books)
  } else {
    res.status(404).json({ error: 'Author not found' })
  }
})

app.get('/books', async (req, res) => {
  const { title, author } = req.query
  const titleRegex = new RegExp(title, 'i')
  const authorRegex = new RegExp(author, 'i')

  const books = await Book.find({
    title: titleRegex,
    authors: authorRegex
  })
  res.json(books)
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
