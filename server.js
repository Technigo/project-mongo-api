/* eslint-disable linebreak-style */

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number

})

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Book.deleteMany()

    await booksData.forEach((item) => {
      const newBook = new Book(item)
      newBook.save()
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


// endpoint to get all books
app.get('/books', async (req, res) => {
  const books = await Book.find()
  res.json(books) 
})

// endpoint to get one book
app.get('/books/:id', (request, response) => {
  const { id } = request.params
  const book = booksData.find((item) => item.bookID === +id)
  
  if (book) {
    response.json({ data: book })
  } else {
    response.status(404).json({ error: 'Not found' })
  }
})




// query parameters, filtering data

app.get('/books', (req, res) => {
  const { authors } = req.query
  const queriedBooks = booksData.filter((book) => {
    return book.authors.toLowerCase().indexOf(authors.toLowerCase()) !== -1
  }) 
  
  if (queriedBooks.length > 0) {
    res.json({ data: queriedBooks })
  } else {
    res.status(404).json({ error: 'Not found' })
  }
})





// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
