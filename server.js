import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'
// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body pa rsing
app.use(cors())
app.use(bodyParser.json())


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


// ROUTES
app.get('/', (req, res) => {
  res.send('Welcom to my book-API')
})

app.get('/books', async (req, res) => {
  const queryParameters =  req.query
  console.log(queryParameters)

  const allBooks = await Book.find(queryParameters);
  res.json(allBooks)
})

app.get('/books/:id', async (req, res) => {
  const { id } = req.params;
  const singleBook = await Book.find({ bookID: +id })
  
  res.json(singleBook);
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})