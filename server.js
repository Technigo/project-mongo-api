import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import booksData from './data/books.json'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!

// import booksData from './data/books.json'

//set up code for the dataBase
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo" //look for URL that is deployed some where
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080 //fundamental settings
const app = express() //intiating the express app

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())


// This is our first endpoint //if remove this we get "Cannot GET response in browser" it's built in by express. The server is running but there aren't any information.
app.get('/', (req, res) => { //This app.get method takes two arguments: path and maybe users or movies. //The second argument is a call back function that communicates with the front end. 
  //The request (req) is what the frontend sends to the backend. The response (res) is what the backend send to the frontend.
  res.send('Hello from Rosanna to you!')
})

// new mongoose model: Title
const Book = mongoose.model('Book', { //First it takes 2 arguments, users and an object. 'Title' is the name of the model.
  //Here we set up how the user should be stored  // here you type the data. You can type mongoose.Type.String.
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



if (process.env.RESET_DB) { //is the environment variable is true then we want to save the books
  const seedDatabase = async () => { //this is a syncrounus function
    await Book.deleteMany({}) //first it does this part

    booksData.forEach(item => { //for each loop the array of books
      const newBook = new Book(item) //the item is the new information 
      newBook.save()
    })
  }
  seedDatabase()
}

// get a list of the books (from json file)
app.get('/books', (req, res) => {
  res.json(booksData)
})

// get a specific book based on its id, using param
app.get('/books/:bookid', (req, res) => { //this endpoint is about finding the book with the specific Id
  const { bookid } = req.params

  const book = booksData.find(book => book.bookID == bookid)

  if (!book) {
    res.status(404).send('No book found with that id')
  } else {
    res.json(book)
  }
})


// get a specific rating on book higher then route parameter
app.get('/books3/:rating', (req, res) => {
  const { rating } = req.params

  const books = booksData.filter(book => book.average_rating >= rating)

  if (books.length === 0) {
    res.status(404).send('No books with that rating was found')
  } else {
    res.json(books)
  }
})


// Start the server 
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port} ROSANNA TEST`)
})

//Remember to use terminal and Postman A LOT!!!
//nodemon makes the server listen to changes like a liveserver