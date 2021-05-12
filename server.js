import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Books schema
const bookSchema = new mongoose.Schema({
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

// Book Model (with schema added)
const Book = mongoose.model('Book', bookSchema)

const newBook = new Book({
  bookdID: 1465,
  title: 'Anna Lindgrens Path To Developer',
  authors: 'Anna Lindgren',
  average_rating: 5,
  isbn: 123456,
  isbn13: 1234567,
  num_pages: 200,
  ratings_count: 5,
  text_reviews_count: 800
})
newBook.save()

const port = process.env.PORT || 8091
const app = express()

app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// app.get('/books', async (req, res) => {
//   const books = await Book.find()
//   res.json(books)
// })

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
