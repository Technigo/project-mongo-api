import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const bookSchema = new mongoose.Schema({ 
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

const Book = mongoose.model('Book', bookSchema); 


if(process.env.RESET_DB) {
  const BookDB = async () => {
    await Book.deleteMany(); 
    await booksData.forEach(item => { 
      const newBook = new Book(item);
      newBook.save()
    })
  }
  BookDB()
}

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

// #1 Find books collection
app.get('/books', async (req,res) => { 
  myAPI = await Book.find() 
  res.json({length: myAPI.length, data: myAPI})
})

// #2 Find member by id
app.get('/books/:memberId', async (req, res) => {
  const { memberId } = req.params;
  try {
    myAPI = await Book.findById(memberId);
    if(myAPI) {
      res.json({length: myAPI.length, data: myAPI})
    } else {
      res.status(404).json({ error: 'Not found'});
    }
  } catch {
    res.status(400).json({ error: 'Invalid request'})
  }
  res.json({length: myAPI.length, data: myAPI});
});

// #3 Find author by name 
app.get('/books/name/:authorName', async (req,res) => { 
  const { authorName } = req.params;
  myAPI = await Book.find(
     {authors: {$regex: authorName}});
  res.json({length: myAPI.length, data: myAPI})
})

// #4 Minimum page filter
app.get('/books/minpage/:pages', async (req,res) => {
  const { pages } = req.params;
  myAPI = await Book.find({ num_pages: { $gte: pages}});
  res.json({length: myAPI.length, data: myAPI})
})

// #5 Max Page filter
app.get('/books/maxpage/:pages', async (req,res) => {
  const { pages } = req.params;
  myAPI = await Book.find({ num_pages: { $lte: pages}});
  res.json({length: myAPI.length, data: myAPI})
})

// #6 Ratings filter 
app.get('/books/minrating/:rating', async (req,res) => {
  const { rating } = req.params;
  myAPI = await Book.find({ average_rating: { $gte: rating}});
  res.json({length: myAPI.length, data: myAPI})
})

// #7 Find book by ISBN number
app.get('/books/isbn/:isbn', async (req,res) => {
  const { isbn } = req.params;
  try {
    myAPI = await Book.findOne({ isbn: isbn});
    if(myAPI) {
      res.json({length: myAPI.length, data: myAPI})
    } else {
      res.status(404).json({ error: 'Not found'});
    }
  } catch {
    res.status(400).json({ error: 'Invalid request'})
  }
  res.json({length: myAPI.length, data: myAPI});
})

// #8 20 Highest rated books 
app.get('/highestrated', async (req,res) => { 
  myAPI = await Book.aggregate([
    {$sort: {average_rating:-1}},
    {$limit:20},
    {$unset: ["isbn","isbn13", "__v","_id","ratings_count","text_reviews_count","language_code","bookID"]}
  ]) 

  res.json({length: myAPI.length, data: myAPI})
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})



