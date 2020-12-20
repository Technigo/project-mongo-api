import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
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
app.use(bodyParser.json())

//Model for Book
const Book = new mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    await Book.deleteMany()

    booksData.forEach(item => {
      const newBook = new Book(item)
      newBook.save()
    })
  }
  populateDatabase()
}

//________ Routes/Endpoints ________ //
app.get('/', (req, res) => {
  res.json('👋 Welcome to Emmas book and book reviews API! Use the /books endpoint to see all books 📚🦉. Use the id-parameter to find one book, for example: books/5.')
})

//Finding all books
app.get('/books', async (req, res) => {
  const allBooks = await Book.find()

    if (!allBooks) {
      res.status(404).json({error: 'Books not found'})
    } else {
      res.json(allBooks)
    } 
})

//Finding a single book based on bookID
app.get('/books/:bookID', async (req, res) => {
  try {
    const singleBook = await Book.findOne({ bookID: req.params.bookID })

    if (singleBook) {
      res.json(singleBook)
    } else {
      res.status(404).json({error: 'Book not found'})
    } 
  } catch (error) {
      res.status(400).json({error: 'Invalid book id'})
    }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
