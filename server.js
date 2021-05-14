import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import dotenv from 'dotenv'

import booksData from './data/books.json'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defining models 
const bookSchema = new mongoose.Schema({
  bookId: Number,
  title: {
    type: String,
    lowercase: true
  },
  authors: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    lowercase: true
  },
  average_rating: Number,
  isbn: String,
  language_code: {
    type: String,
    lowercase: true
  },
  num_pages: Number,
  ratings_count: Number
})

const Book = mongoose.model('Book', bookSchema)

const Author = mongoose.model('Author', {
  authors: String
})

// The seedDB is going to re-run everytime we start the server, if we don't want that
// to happen and want to be able to choose when that should happen, we can wrap it
// in an environment variable
if (process.env.RESET_DATABASE) {
  const seedDB = async () => {
    await Book.deleteMany()
    await Author.deleteMany()

    const authorsArray = []

    booksData.forEach(async (item) => {
      const author = new Author(item)
      authorsArray.push(author)
      await author.save()
    })

    booksData.forEach(async (item) => {
      const newBook = new Book({
        ...item,
        authors: authorsArray.find(singleAuthor => singleAuthor.authors === item.authors)
      })
      await newBook.save()
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
  res.send(listEndpoints(app))
})

// endpoint to get all books 
app.get('/books', async (req, res) => {
  const books = await Book.find().populate('authors')
  res.json({ length: books.length, data: books })
})

// endpoint to get single book by id path param
app.get('/books/book/:bookId', async (req, res) => {
  const { bookId } = req.params

  try {
    const singleBook = await Book.findById(bookId).populate('authors')
    if (singleBook) {
      res.json({ length: singleBook.length, data: singleBook }) 
    } else {
      res.status(404).json({ error: 'No book with that id was found!'})
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid request'})
  }
}) 

// endpoint to get author by path param id for single book
app.get('/books/book/:bookId/author', async (req, res) => {
  const { bookId } = req.params

  try {
    const singleBook = await Book.findById(bookId).populate('authors');
    if (singleBook) {
      const author = await Author.findById(singleBook.authors);
      res.json({ length: author.length, data: author });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch {
    res.status(400).json({ error: 'Invalid request' });
  }
})

// endpoint with search path and query param for title
app.get('/books/search', async (req, res) => {
  const { title } = req.query

  if (title) {
    const queriedBook = await Book.find({
      title: {
        $regex: new RegExp(title, 'i')
      }
    }).populate('authors')
    res.json({ length: queriedBook.length, data: queriedBook })
  } else {
    const books = await Book.find().populate('authors')
    res.json({ length: books.length, data: books })
  }
})


// endpoint to get all authors 
app.get('/authors', async (req, res) => {
  const authors = await Author.find()
  res.json({ length: authors.length, data: authors })
})

// endpoint to get author based on id
app.get('/authors/:authorId', async (req, res) => {
  const { authorId } = req.params

  try {
    const author = await Author.findById(authorId)
    if (author) {
      res.json({ length: author.length, data: author })
    } else {
      res.status(404).json({ error: 'No author with that id was found!'})
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid request'})
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
