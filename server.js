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
const port = process.env.PORT || 7000
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Mongoose model
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
});

app.get('/books', (req, res) => {
  const queryString = req.query.title
  const queryRegex = new RegExp(queryString, "i")

  // Using query for title
  Book.find({ 'title': queryRegex })
    .sort({ 'num_pages': -1 })
    .then((results) => {
      // Successful result
      console.log('Found : ' + results);
    }).catch((err) => {
      // Failure
      console.log('Error ' + err);
      res.json({ message: "Book not found", err: err })
    });
});


app.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  Book.find({ 'isbn': isbn })
    .then((results) => {
      res.json(results);
    }).catch((err) => {
      res.json({ message: 'Book not found', err: err });
    })
});

app.get('/books/_id/:_id', (req, res) => {
  const _id = req.params._id
  Book.findOne({ '_id': _id })
    .then((results) => {
      res.json(results)
    }).catch((err) => {
      res.json({ message: 'Cannot find this book', err: err })
    })
})


if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({})

    booksData.forEach((bookData) => {
      new Book(bookData).save()
    })
  }
  seedDatabase()
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Books API')
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})