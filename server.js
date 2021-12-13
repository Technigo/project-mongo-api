import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import booksData from './data/books.json'

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

// new mongoose model: Book
const Book = mongoose.model('Book', { //First it takes 2 arguments, users and an object. 'Book' is the name of the model.
  //Here we set up how the books should be stored  // here you type the data. You can type mongoose.Type.String.
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
app.get('/books', async (req, res) => {
  const titles = await Book.find()
  res.json(titles)
})

// get a specific book based on its id, using param
app.get('/books/:id/', async (req, res) => {
  const book = await Book.findOne({ bookID: req.params.id })

if (book) {
  res.json(book)
}
else {
  res.status(404).send('No book with that id was found')
}
})

// get a specific rating on book 
app.get('/books-rating/:rating', async (req, res) => {
  const books = await Book.find({ average_rating: {$gte : req.params.rating } }) //average rating is an object //gte=greater than or equal.

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