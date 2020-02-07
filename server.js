import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import { restart } from 'nodemon'

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
  bookID: {
    type: Number
  },
  title: {
    type: String
  },
  authors: {
    type: String
  },
  average_rating: {
    type: Number
  },
  isbn: {
    unique: true,
    type: String
  },
  isbn13: {
    type: String
  },
  language_code: {
    type: String
  },
  num_pages: {
    type: Number
  },
  ratings_count: {
    type: Number
  },
  text_reviews_count: {
    type: Number
  }
})

booksData.forEach((book) => {
  new Book(book).save()
})

// const Animal = mongoose.model('Animal', {
//   name: String,
//   age: Number,
//   isFurry: Boolean
// })

// if (process.env.RESET_DATABASE) {
//   console.log('RESETTING')
//   const seedDatabase = async () => {
//     await Author.deleteMany()
//     const tolkien = new Author({ name: 'J.R.R Tolkien' })
//     await tolkien.save()
//     const adams = new Author({ name: 'Douglas Adams' })
//     await adams.save()
//     const bryson = new Author({ name: 'Bill Bryson' })
//     await bryson.save()

//     await Book.deleteMany()

//     await new Book({
//       title: 'The Fellowship of the Ring',
//       author: tolkien
//     }).save()
//     await new Book({ title: 'The two towers', author: tolkien }).save()
//     await new Book({ title: 'The return of theh king', author: tolkien }).save()
//     await new Book({
//       title: 'Hitchhikers Guide to the Galaxy',
//       author: adams
//     }).save()
//     await new Book({
//       title: 'The Long Dark Tea-Time of the Soul',
//       author: adams
//     }).save()
//     await new Book({ title: 'The Salmon of Doubt', author: adams }).save()
//     await new Book({
//       title: 'Bill Brysons African Diary',
//       author: bryson
//     }).save()
//   }
//   seedDatabase()
// }

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
  res.json('Books')
})
// Start defining your routes here
app.get('/authors', async (req, res) => {
  const authors = await Author.find().populate('books')
  res.json(authors)
})

app.get('/authors/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    if (author) {
      res.json(author)
    } else {
      res.status(404).json({ error: 'author not found' })
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid id' })
  }
})

app.get('/authors/:id/books', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    if (author) {
      const books = await Book.find({
        author: mongoose.Types.ObjectId(author.id)
      }).populate('author')
      res.json(books)
    } else {
      res.status(404).json({ error: 'author and books not found' })
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid id' })
  }
})

app.get('/books', async (req, res) => {
  const books = await Book.find().populate('author')
  res.json(books)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
