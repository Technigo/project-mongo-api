import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')

dotenv.config()

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import data from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
import data from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'
// import data from './data/volcanos.json'

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
  text_reviews_count: Number,
})

// clear db

// insert data to db
Book.deleteMany().then(() => {
  new Book({
    bookID: 36,
    title: 'The Lord of the Rings: Weapons and Warfare',
    authors: 'Chris   Smith-Christopher  Lee-Richard Taylor',
    average_rating: 4.53,
    isbn: 618391002,
    isbn13: 9780618391004,
    language_code: 'eng',
    num_pages: 218,
    ratings_count: 18934,
    text_reviews_count: 43,
  }).save()
})

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
  const authors = await Book.find()
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
 *      - name: sortRating
 *        in: query
 *        required: false
 *        format: boolean
 *      - name: pageCountLow
 *        in: query
 *        required: false
 *        format: integer
 *      - name: pageCountHigh
 *        in: query
 *        required: false
 *        format: integer
 *      - name: sortPageCount
 *        in: query
 *        required: false
 *        format: boolean
 *     responses:
 *       200:
 *         description: OK.
 */
app.get('/books/search', (req, res) => {
  const { title, rating, sortRating, pageCountHigh, pageCountLow, sortPageCount } = req.query

  let resultsToSend = data
  let pageCountUpperLimit = Infinity
  let pageCountLowerLimit = 0
  let ratingLowerLimit = 0

  if (pageCountHigh) {
    pageCountUpperLimit = pageCountHigh
  }
  if (pageCountLow) {
    pageCountLowerLimit = pageCountLow
  }
  if (rating) {
    ratingLowerLimit = rating
  }
  if (sortRating) {
    resultsToSend.sort((a, b) => b.average_rating - a.average_rating)
  }
  if (sortPageCount) {
    resultsToSend.sort((a, b) => b.num_pages - a.num_pages)
  }
  if (title) {
    resultsToSend = resultsToSend.filter(
      item => item.title.toLowerCase().indexOf(title.toLowerCase()) !== -1
    )
  }

  const filteredData = resultsToSend
    .filter(item => item.average_rating >= ratingLowerLimit)
    .filter(item => item.num_pages <= pageCountUpperLimit)
    .filter(item => item.num_pages >= pageCountLowerLimit)

  res.json({ filteredData, success: true })
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
    const book = await Book.findOne({ isbn: +isbn })
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
app.get('/lang/:lang', (req, res) => {
  const { lang } = req.params
  let filteredData
  if (lang === 'list') {
    filteredData = data.map(item => item.language_code).filter((v, i, a) => a.indexOf(v) === i)
  } else {
    filteredData = data.filter(item => item.language_code === lang)
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
