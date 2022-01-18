
import express from 'express'
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
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Here are all your books')
})

// new mongoose model: Book
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

    booksData.forEach((item) => { 
      const newBook = new Book(item) 
      newBook.save()
    })
  }
  seedDatabase()
}

// get a list of the books (from json file)
app.get('/books', async (req, res) => {
  const titles = await Book.find()
  res.json(titles)
})

// get a specific book based on its id, using param
app.get('/books/:id/', async (req, res) => {
  const book = await Book.findOne({ bookID: req.params.id })

  if (book) {
    res.json(book)
  } else {
    res.status(404).send('No book with that id was found')
  }
})

// get a specific rating on book 
app.get('/books-rating/:rating', async (req, res) => {
  const books = await Book.find({ average_rating: { $gte: req.params.rating } })

  if (books.length === 0) {
    res.status(404).send('No books with that rating was found')
  } else {
    res.json(books)
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port} TEST TEST`)
})
