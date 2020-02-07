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

// const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books"
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
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
    type: Number
  },
  isbn13: {
    type: Number
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
  },
})

// booksData.forEach((book) => { //This forEach-loop saves the bokks to the data base, so all the books from the json are put in the data base
//   new Book(book).save();
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

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/books', (req, res) => {
  const queryString = req.query.q;
  const queryRegex = new RegExp(queryString, 'i');
  Book.find({ 'title': queryRegex })
    .then((results) => {
      //Successfull
      console.log('Found ' + results);
      res.json(results);
    }).catch((err) => {
      //Error/failure
      console.log('Error ' + err);
      res.json({ message: 'Cannot find this book' })
    })
})

app.get('/authors', async (req, res) => {
  const authors = await Author.find()
  res.json(authors)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
