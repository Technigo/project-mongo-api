import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const bookSchema = new mongoose.Schema({
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

const Book = mongoose.model('Book', bookSchema)

if (process.env.RESET_DB) {
  const seedDataBase = async () => {
    await Book.deleteMany()

    await booksData.forEach(item => {
      const newBook = new Book(item)
      newBook.save()
    })
  }
  seedDataBase()
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// Endpoint that shows all books
app.get('/books', async (req, res) => {
  const books = await Book.find()
  res.json(books)
})

// Endpoint that shows a specific book
app.get('/books/:id', async (req, res) => {
  const { id } = req.params
  const singleBook = await Book.findOne({ bookID: +id })

  if (singleBook) {
    res.json(singleBook)
  } else {
    res.status(404).json({ error: 'Could not find this book'})
  }
  
})


// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
