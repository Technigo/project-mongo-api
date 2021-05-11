import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defining models 
const bookSchema = new mongoose.Schema({
   // bookID: {
  // },
  title: String,
  authors: String,
  average_rating: Number,
  isbn: String,
  language_code: String,
  num_pages: Number,
  ratings_count: Number
})

const Book = mongoose.model('Book', bookSchema)

// The seedDB is going to re-run everytime we start the server, if we don't want that
// to happen and want to be able to choose when that should happen, we can wrap it
// in an environment variable
if (process.env.RESET_DATABASE) {
  const seedDB = async () => {
    await Book.deleteMany()

    await booksData.forEach(item => {
      const newBook = new Book(item)
      newBook.save()
    })
  }
  seedDB()
}

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/books', async (req, res) => {
  const books = await Book.find()
  res.json(books)
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
