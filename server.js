import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import booksData from './data/books.json'
import listEndpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on
const port = process.env.PORT || 8080
const app = express()

// middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// middleware that checks if database is connected before going to the endpoints
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

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

// seed the database with data of books
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({})

    booksData.forEach(book => {
      new Book(book).save()
    })
  }

  seedDatabase()
}

// main endpoint
app.get('/', (req, res) => {
  res.send('Hello world')
})

// list of endpoints
app.get('/endpoints', (req, res) => {
  res.send(listEndpoints(app))
})

// endpoint to get all the books
app.get('/books', async (req, res) => {
  const books = await Book.find()
  res.json(books)
})

// endpoint to get a specific book based on id
app.get('/books/:id', async (req, res) => {
  const { id } = req.params

  try {
    const bookId = await Book.findById(id)

    if (!bookId) {
      res.status(404).json({
        response: 'No book found with that id',
        success: false
      })
    } else {
      res.status(200).json({
        response: bookId,
        success: true
      })
    }
  } catch (err) {
    res.status(400).json({ error: 'Id is invalid'})
  }
})

// endpoint to get a specific book based on title
app.get('/books/title/:title', async (req, res) => {
  const { title } = req.params
  
  try {
    const bookTitle = await Book.find(title)
  
    if (!bookTitle) {
      res.status(404).json({
        response: 'No book found with that title',
        success: false
      })
    } else {
      res.status(200).json({
        response: bookTitle,
        success: true
      })
    }
  } catch {
    res.status(400).json({ error: 'Title is invalid'})
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
