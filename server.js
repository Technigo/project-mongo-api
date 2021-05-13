import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import booksData from './data/books.json'

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
  res.json(books)
})

//endpoint to get single book by id path param
app.get('/books/book/:bookId', async (req, res) => {
  const { bookId } = req.params

  try {
    const singleBook = await Book.findById(bookId)

    if (singleBook) {
      res.json(singleBook) 
    } else {
      res.status(404).json({ error: 'No book with that id was found!'})
    }
  } catch (err) {
    res.status(400).json({ error: 'Something went wrong.'})
  }
}) 

// endpoint with search path and query param for author
app.get('/books/search', async (req, res) => {
  const { author } = req.query

  if (author) {
    const books = await Book.find({
      authors: {
        $regex: new RegExp(author, 'i')
      }
    })
    res.json(books)
  } else {
    const books = await Book.find()
    res.json(books)
  }
})

// endpoint to get all authors 
app.get('/authors', async (req, res) => {
  const authors = await Author.find()
  res.json(authors)
})

// endpoint to get author based on id
app.get('/authors/:authorId', async (req, res) => {
  const { authorId } = req.params

  try {
    const author = await Author.findById(authorId)
    if (author) {
      res.json(author)
    } else {
      res.status(404).json({ error: 'No author with that id was found!'})
    }
  } catch (err) {
    res.status(400).json({ error: 'Something went wrong.'})
  }
})

// endpoint to get all books based on author id - does not work 
// app.get('/authors/:authorId/books', async (req, res) => {
//   const { authorId } = req.params

//   try {
//     const author = await Author.findById(authorId)
//     if (author) {
//       const books = await Book.find({ authors: mongoose.Types.ObjectId(author.authorId)})
//       res.json(books)
//     } else {
//       res.status(404).json({ error: 'No author with that id was found!'})
//     } 
//   } catch (err) {
//     res.status(400).json({ error: 'Something went wrong.'})
//   }
// })


// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
