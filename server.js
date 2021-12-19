import express from 'express'
import cors from 'cors'
import mongoose, { Schema } from 'mongoose'
import dotenv from 'dotenv'

const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')

dotenv.config()

import data from './data/books.json'

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'The Book API',
      version: '1.0.0',
    },
  },
  apis: ['./server.js'], // files containing annotations as above
}
const swaggerSpec = swaggerJsdoc(options)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/books' //'mongodb://localhost/books'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const bookSchema = new Schema({
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
})

bookSchema.index({ title: 'text' })

const Book = mongoose.model('Book', bookSchema)

// insert data to db
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({})

    data.forEach(item => {
      const newBook = new Book(item)
      newBook.save()
    })
  }

  seedDatabase()
}

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Lists all Authors
 *     responses:
 *       200:
 *         description: OK.
 */
app.get('/authors', async (req, res) => {
  const authors = await Book.distinct('authors')
  res.json(authors)
})

/**
 * @swagger
 * /key:
 *   get:
 *     summary: Lists api key
 *     responses:
 *       200:
 *         description: OK.
 */
app.get('/key', (req, res) => {
  res.send(process.env.API_KEY)
})

/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: List books based on query
 *     parameters:
 *      - name: title
 *        in: query
 *        required: false
 *        format: string
 *      - name: rating
 *        in: query
 *        required: false
 *        format: integer
 *        description: Numeric with "." as decimal separator
 *      - name: sortRating
 *        in: query
 *        required: false
 *        format: string
 *        description: ascending or descending
 *      - name: pageCountLow
 *        in: query
 *        required: false
 *        format: integer
 *        description: Filter books with page count higher than
 *      - name: pageCountHigh
 *        in: query
 *        required: false
 *        format: integer
 *        description: Filter books with page count lower than
 *     responses:
 *       200:
 *         description: OK.
 */
app.get('/books/search', async (req, res) => {
  const { title, rating, sortRating, pageCountHigh, pageCountLow } = req.query

  let pageCountUpperLimit = Infinity
  let pageCountLowerLimit = 0
  let ratingLowerLimit = 0
  let titleSearch = ''

  try {
    if (pageCountHigh) {
      pageCountUpperLimit = pageCountHigh
    }
    if (pageCountLow) {
      pageCountLowerLimit = pageCountLow
    }
    if (rating) {
      if (rating.includes(',')) {
        throw 'rating must be number formatted with . as decimal separator'
      } else {
        ratingLowerLimit = rating
      }
    }
    if (title) {
      titleSearch = title
    }
    const filteredData = await Book.find({
      average_rating: { $gte: ratingLowerLimit },
      num_pages: { $lte: pageCountUpperLimit },
      num_pages: { $gte: pageCountLowerLimit },
      title: { $regex: titleSearch, $options: 'i' },
    }).sort({ average_rating: sortRating })

    res.json({
      response: filteredData,
      success: true,
      parameters: {
        title: titleSearch,
        rating: ratingLowerLimit,
        sortRating: sortRating,
        pageCountHigh: pageCountUpperLimit,
        pageCountLow: pageCountLowerLimit,
      },
    })
  } catch (err) {
    res.json({ error: err })
  }
})

/**
 * @swagger
 * /book/isbn/{isbn}:
 *   get:
 *     summary: Returns a book by ISBN
 *     parameters:
 *      - name: isbn
 *        in: path
 *        required: true
 *        format: integer
 *     responses:
 *       200:
 *         description: OK.
 */
app.get('/book/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params
  try {
    const book = await Book.findOne({ $or: [{ isbn: +isbn }, { isbn13: +isbn }] })
    if (!book) {
      res.status(404).send('No data found')
    } else {
      res.json(book)
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid isbn' })
  }
})

/**
 * @swagger
 * /books/all:
 *   get:
 *     summary: Returns all books
 *     responses:
 *       200:
 *         description: OK.
 */
app.get('/books/all', (req, res) => {
  Book.find().then(books => {
    res.json(books)
  })
})

/**
 * @swagger
 * /lang/{lang}:
 *   get:
 *     summary: Returns all books by language
 *     parameters:
 *      - name: lang
 *        in: path
 *        required: true
 *        format: string
 *     responses:
 *       200:
 *         description: OK.
 */
app.get('/lang/:lang', async (req, res) => {
  const { lang } = req.params

  let filteredData
  if (lang === 'list') {
    filteredData = await Book.distinct('language_code')
  } else {
    filteredData = await Book.find({ language_code: lang })
  }
  if (!filteredData) {
    res.status(404).send('No data found')
  } else {
    res.json(filteredData)
  }
})

/**
 * @swagger
 * /post:
 *   post:
 *     summary: Returns request body as json
 *     parameters:
 *      - name: body
 *        in: body
 *        required: false
 *     responses:
 *       200:
 *         description: OK.
 */
app.post('/post', (req, res) => {
  const { body } = req
  res.json(body)
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
