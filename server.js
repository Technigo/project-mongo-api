import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import booksData from './data/books.json'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/mongo-books"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const bookSchema = new mongoose.Schema({
  bookID: Number,
  title: {
    type: String,
    lowercase: true
  },
  authors: {
    type: String,
    uppercase: true
  },
  average_rating: Number,
  num_pages: Number,
  ratings_count: Number,
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
  res.send(listEndpoints(app))
})

// Endpoint that shows all books
app.get('/books', async (req, res) => {
  const books = await Book.find(req.query)
  res.json(books)
})


// Endpoint that shows a book by id
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
