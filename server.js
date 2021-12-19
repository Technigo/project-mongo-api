import express, { response } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import listEndpoints from 'express-list-endpoints'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'


// !!!!!!!! DONT DEPLOY BEFORE SECRET IS FIXED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books"
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

const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: String,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})


// Seed database
  if (process.env.RESET_DB) {
    const seedDatabase = async () => {
      await Book.deleteMany({})  
        booksData.forEach(item => {
          const newBook = new Book(item)
          newBook.save()
        })
      }
    seedDatabase()
}


// Start routes
app.get('/', (req, res) => {
  const hello = {
    Welcome: 'Hello! This be a Book API 2.0',
    Routes: [{
      "/books_________________________": 'Get all books.',
      "/books/id/'number'_____________": 'Get books with matching database id.',
      "/books/isbn/'number'___________": 'Get books by unique ISBN nr.',
      "/books?num_pages='number'______": 'Get books with certain amount of pages and over.',
      "/books?average_rating='number'_": 'Get books by rating, ascending.',
      "/endpoints_____________________": 'Get API endpoints.'
    }]
    
  }
  res.send(hello)
})

// get all the books
app.get('/books', async (req, res) => {
  let books = await Book.find(req.query)

  if(req.query.num_pages) {
    const booksByPages = await Book.find().gt('num_pages', req.query.num_pages)
    books = booksByPages
  }

  if(req.query.average_rating) {
    const booksByRating = await Book.find().gt('average_rating', req.query.average_rating)
    books = booksByRating
  }

  res.json(books)
})

// get book by db id
app.get('/books/id/:id', async (req, res) => {
  try {
    const bookById = await Book.findById(req.params.id)
  if (bookById) {
    res.json(bookById)
  } else {
    res.status(404).json({error: "Book not found"})
    } 
  }catch (err) {
    res.status(400).json({error: "Error"})
    }
})

// Books by ISBN
app.get('/books/isbn/:isbnNr', async (req, res) => {
  const { isbnNr } = req.params

  try {
    const book = await Book.findOne({ isbn: isbnNr })
    if (book) {
      res.json(book)
    } else {
      res.status(404).json({ error: 'Book not found' })
    }
  } catch(error) {
    res.status(400).json({ error: 'Error' })
  }
})

// Endpoints
app.get('/books/endpoints', (req, res) => {
  res.send(listEndpoints(app))
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
