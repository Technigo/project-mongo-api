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

const bookSchema = new mongoose.Schema({ // #1
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



const Book = mongoose.model('Book', bookSchema); // #2
/*
const newAuthor = new Book({
  bookID: 50888,
  title: "Bowmaking",
  authors: "Fethullah Dincer",
  average_rating: 10,
  isbn: 102030,
  isbn13: 405060,
  language_code: "SE",
  num_pages: 500,
  ratings_count: 5050566060,
  text_reviews_count: 87820206 
})
newAuthor.save() */ 

if(process.env.RESET_DB) {
  const BookDB = async () => {
    await Book.deleteMany(); // Delete all the documents from our collection so that it is clean before we load our data and we dont get duplicate
    await booksData.forEach(item => { // Här skapar 
      const newBook = new Book(item);
      newBook.save()
    })
  }
  
  BookDB()
  
}




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

let myAPI

// #1 Find books
app.get('/books', async (req,res) => { // Har lagt till limit som vi kan lägga en variabel på och sedan ändra när vi trycker på load i frontend
  //const find = req.params
  const books = await Book.find().limit(20) // Här är våran collection vi skapar

  res.json({length: books.length, data: books})
})


// #2 Find member id
app.get('/books/:memberId', async (req, res) => {
  const { memberId } = req.params;

  const singleID = await Book.findById(memberId);

  res.json(singleID);
});

// #3 Find author name 
app.get('/books/name/:authorName', async (req,res) => {
  const { authorName } = req.params;

  const singleAuthor = await Book.find( {authors: {$regex: authorName}});

  res.json(singleAuthor)
})



// #4 Min page filter
app.get('/books/minpage/:pages', async (req,res) => {
  const { pages } = req.params;

  const minPages = await Book.find({ num_pages: { $gte: pages}});

  res.json({length: minPages.length, data: minPages})
})

// #5 Max Page filter
app.get('/books/maxpage/:pages', async (req,res) => {
  const { pages } = req.params;

  const maxPages = await Book.find({ num_pages: { $lte: pages}});

  res.json({length: maxPages.length, data: maxPages})
})

// #6 Ratings filter (GÖR en select)
app.get('/books/minrating/:rating', async (req,res) => {
  const { rating } = req.params;

  const minRating = await Book.find({ average_rating: { $gte: rating}});

  res.json({length: minRating.length, data: minRating})
})

// #7 Find ISBN name
app.get('/books/isbn/:isbn', async (req,res) => {
  const { isbn } = req.params;

  const findIsbn = await Book.findOne({ isbn: isbn});

  res.json(findIsbn)
})

// Gör en öppen input fält där man kan skriva vad som helst


// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})



