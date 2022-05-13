import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// MODEL
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

// POPULATE DATABASE & START
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({}) //ASYNC AWAIT TO PREVENT DUPLICATION
    //LOOP THROUGH THE BOOKS DATA, CREATES A NEW OBJECT
    booksData.forEach(item => {
      const newBook = new Book(item)
      newBook.save()
    })
  }
  seedDatabase()
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(
    {"Tja":"This is an open API for Books!",
    "Routes": [{"/books":"All Books","/books-title/:title":"Get Books by title","/books-id/:id":"Get Books by Id"}]}
  )
})

// ALL ENDPOINTS
app.get('/books', (req, res) => {
  Book.find().then(books => {
    res.json(books)
  })
})

// ENDPOINT FOR SPECIFIC TITLE
app.get('/books-title/:title', (req, res) => {
  Book.findOne({ title: req.params.title }).then(book => {
    if (book) {
      res.json(book)
    } else {
      res.status(404).json({ error: 'No book with that title was found' })
    }
  })
})

// ENDPOINT FOR SPECIFIC BOOK 
app.get('/books-id/:id', async (req, res) => {
  const book = await Book.findOne({ bookID: req.params.id })
  if (book) {
    res.json(book)
  } else {
    res.status(404).json({ error: 'No book with that ID was found' })
  }
})

// ENDPOINT FOR SPECIFIC AUTHOR
app.get('/books-authors/:authors', async (req, res) => {
  const book = await Book.findOne({ authors: req.params.authors })
  if (book) { 
    res.json(book)
  } else {
    res.status(404).json({ error: 'No book by that author was found' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
