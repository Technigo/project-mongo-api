import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

//Middleware to handle connections errors
app.use((req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      next()
    } else {
      res.status(503).json({ error: 'Service unavailable' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Error! Could not access the server.' });
  }
})

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
    await Book.deleteMany();

    booksData.forEach(item => {
      const newBook = new Book(item);
      newBook.save();
    })
  }
  populateDatabase();
}


app.get('/', (req, res) => {
  res.send('Welcome to my book-API 📚')
})

//get all books
app.get('/books', async (req, res) => {
  const allBooks = await Book.find(req.query)
  res.json(allBooks)
})

//get a book based on id
app.get('/books/:id', async (req, res) => {
  try {
    const singleBook = await Book.findOne({ bookID: req.params.id })

    if (singleBook) {
      res.json(singleBook)
    } else {
      res.status(404).json({ error: 'Book not found' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid book-id' })
  }
})

//get books from chosen author
app.get('/books/authors/:author', async (req, res) => {
  const booksByAuthor = await Book.find({ authors: req.params.author })
  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor)
  } else {
    res.status(404).json({ error: "Invalid author" })
  }
})

//get a book with a certain title
app.get('/books/titles/:title', async (req, res) => {
  const bookTitle = await Book.findOne({title: req.params.title})
  if (bookTitle) {
    res.json(bookTitle); 
  }else{
    res.status(404).json({ error: "Invalid title" })  
}
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})