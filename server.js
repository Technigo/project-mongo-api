import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
//import booksData from './data/books.json'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!


// Database setup:
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Mongoose model setup:
  // Book Model
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
  }
})
/*
  isbn search idea: {
    type: String,
    // unique: true
    // But give "Deprecation Warnings" in Node:
    // https://mongoosejs.com/docs/deprecations.html
  },
*/

// To reset database and the populate db:
// $ RESET_DATABASE=true npm run dev
// Seed DATABASE using Async
// forEach loop will put all Books from JSON into database
if (process.env.RESET_DATABASE){
 console.log('Resetting database')

  const seedDatabase = async () => {
    await Book.deleteMany()

    booksData.forEach((book) => {
      new Book(book).save()
    })
  }
 seedDatabase()
}
// Dubbelkolla detta oven först innan SEED till MongoDB
// se databas i Compass! project-mongo / books 
// project-mongo.books



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
  res.send("My API endpoints: /books ,  , plus handling error if no id match")
})

// test, test:
 app.get('/all', async (req, res) => {
   res.json('lala')
 })

// a RESTful route to return all Books:
// http://localhost:8080/books
app.get('/books', async (req, res) => {
  const books = await Book.find()
  res.json(books)
})

// a RESTful route to return ONE Books via ISBN nr::
// http://localhost:8080/books/439785960
app.get('/books/:isbn', async (req, res) => {
  const isbn = req.params.isbn
  Book.findOne({ 'isbn': isbn })
    .then((results) => {
      res.json(results)
    }).catch((err) => {
      // res.json({ message: "Not found", err: err })
      res.status(404).json({ error: 'Book not found' })
    })
})

/*






*/







// find ONE Book per NAME:

 




// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
