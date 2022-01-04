import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

//middleware
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

const Book = mongoose.model('Book', {
  id: Number,
  title: String,
  author: String,
  rating: Number,
  language: String,
  isbn: Number,
  pages: Number,
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({})

    booksData.forEach(book => {
      new Book(book).save()
    })
  }

  seedDatabase()
}

// This is our first endpoint
app.get('/', (req, res) => {
  res.send('Hello world')
})

// get all the books

app.get('/books', async (req, res) => {
  const books = await Book.find()
  res.json(books)
})

// get a specific book based on id
app.get('/books/:id', async (req, res) => {
  try {
    const bookId = await Book.findById(req.params.id)
    if (bookId) {
      res.json(bookId)
    } else {
      res.status(404).json({error: 'No book found with that id'})
    }
  } catch (err) {
    res.status(400).json({ error: 'Id is invalid'})
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
