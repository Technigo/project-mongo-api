import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'

// Sets up the Mongo database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: String,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
});

if (process.env.RESET_DATABASE) {

  const seedDatabase = async () => {
    // Deletes any pre-existing Book objects to prevent duplicates
    await Book.deleteMany({});
    
    // Creates a new Book instance for each book in the booksData
    booksData.forEach((booksData) => {
      new Book(booksData).save();
    })
  }
  seedDatabase();
}


// Defines the port the app will run on. Defaults to 8080
const port = process.env.PORT || 4040
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


app.get('/', (request, response) => {
  response.send('Welcome to my book API created with Mongo')
})

// Endpoint/route that return all of the books in the data 
app.get('/books', async (request, response) => {
  const allBooks = await Book.find()

    response.json(allBooks)
})

// Endpoint/route that return a single book based on the ID
  app.get('/books/book/:bookID', async (request, response) => {
    try {
      const specificBook = await Book.findOne({ bookID: request.params.bookID })
      
        if (specificBook) {
        response.json(specificBook)
        
      } else {
        response.status(404).json({ error: "Sorry, book not found" })
      }
    } catch (err) {
      res.status(400).json({ error: "Sorry, invalid Book ID" })
    }
  })

// Endpoint/route that return books by a specific author
  app.get('/books/authors/:authorName', async (request, response) => {
    const paramsAuthorName = request.params.authorName;

    const authorBooks = await Book.find({ authors: { $regex : new RegExp(paramsAuthorName, "i") } });
  
    if (authorBooks.length === 0) {
      response.status(404).json("Sorry, no books found by that author");
    }
    response.json(authorBooks);
  });


  // Endpoint/route that return top rated books with a rating over 4
  app.get('/books/top-rated', async (request, response) => {
    const topRatedBooks = await Book.find({ average_rating: { $gte: 4 } })

    response.json(topRatedBooks);
  })
  

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
