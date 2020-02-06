import express from 'express'
import bodyParser from 'body-parser'
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

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()



const Book = mongoose.model('Book', {
  bookId: {
    type: Number
  },
  title: {
    type: String
  },
  author: {
    type: String
  },
  average_rating: {
    type: Number
  },
  isbn: {
    type: String,
    uniqe: true
  },
  isbn13: {
    type: String
  },
  language_code: {
    type: String
  },
  ratings_count: {
    type: Number
  },
  ext_reviews_count: {
    type: Number
  }
})

const addBooksToDataBase = () => {
  booksData.forEach((book) => {
    new Book(book).save()
  })
}

// addBooksToDataBase()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/books', (req, res) => {
  const queryString = req.query.q
  const queryRegex = new RegExp(queryString, "i")
  Book.find({ 'title': queryRegex })
    .then((results) => {
      res.json(results)
    }).catch((err) => {
      console.log('Error ' + err)
      res.json({ message: 'Cannot find this book', err: err })
    })
})

app.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  Book.findOne({ 'isbn': isbn })
    .then((results) => {
      res.json(results);
    }).catch((err) => {
      res.json({ message: 'Cannot find this isbn number', err: err });
    });
});

app.get('/books/author/:author', (req, res) => {
  const queryString = req.query.q
  const queryRegex = new RegExp(queryString, "i")
  Book.find({ 'author': queryRegex })
    .then((results) => {
      res.json(results)
    }).catch((err) => {
      console.log('Error ' + err)
      res.json({ message: 'Cannot find this author', err: err })
    })
})

app.get('/books/average_rating', async (req, res) => {
  const rating = await Book.sort({ 'average_rating': -1 })
  res.json(rating)

})

// app.get('books/author', async (req, res) => {
//   const authors = await Book.author.find()
//   res.json(authors)
// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
