import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose, { Aggregate } from 'mongoose'

mongoose.set('useCreateIndex', true)

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/books'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: {
    unique: true,
    type: String
  },
  isbn13: String,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})
//FETCHING THE DATA FROM JSON TO DATABASE
// booksData.forEach((book) => {
//   new Book(book).save()
// })

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

app.get('/', async (req, res) => {
  const bookslength = Book
  res.json(bookslength.length)
})

// Start defining your routes here

app.get('/books', async (req, res) => {
  const books = await Book.find()
  res.json(books)
})

// app.get('/title', async (req, res) => {
//   const qString = req.query.q
//   const qRegEx = new RegExp(qString, 'i')
//   console.log(qString)
//   Book.find({ title: qRegEx })
//     .then((results) => {
//       res.json(results)
//     })
//     .catch((err) => {
//       res.json({ message: 'nope', err: err })
//     })
// })

app.get('/title', async (req, res) => {
  const qString = req.query.q
  const qRegEx = new RegExp(qString, 'i')
  console.log(qString)
  try {
    const results = await Book.find({ title: qRegEx })
    if (results.length) {
      res.json(results)
    } else {
      res.status(404).json({ error: 'cant find any titles' })
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid! code: 400' })
  }
})

app.get('/author', async (req, res) => {
  const qString = req.query.q
  const qRegEx = new RegExp(qString, 'i')
  console.log(qString)
  try {
    const results = await Book.find({ authors: qRegEx })
    if (results.length) {
      res.json(results)
    } else {
      res.status(404).json({ error: 'cant find any authors' })
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid! code: 400' })
  }
})

app.get('/isbn', async (req, res) => {
  const qString = req.query.q
  const qRegEx = new RegExp(qString, 'i')
  console.log(qString)
  try {
    const results = await Book.find({ isbn: qRegEx })
    if (results.length) {
      res.json(results)
    } else {
      res.status(404).json({ error: 'cant find any isbn' })
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid! code: 400' })
  }
})

app.get('/books/:id', async (req, res) => {
  try {
    const bookId = await Book.findById(req.params.id)
    if (bookId) {
      res.json(bookId)
    } else {
      res.status(404).json({ error: 'author not found' })
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid id 400' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
