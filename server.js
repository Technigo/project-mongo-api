import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/book-project"
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
    type: String
  },
  isbn13: {
    type: String
  },
  language_code: {
    type: String,
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

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany()
    booksData.forEach(async (book) => await new Book(book).save())
  }
  seedDatabase()
}

const port = process.env.PORT || 8080
const app = express()
const myEndPoints = require('express-list-endpoints')

app.use(cors())
app.use(bodyParser.json())

//handling data connection error
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable'})
  }
})

app.get('/', (req, res) => {
    
  
  if(!res) {
    res
    .status(404)
    .send({ error: 'Oops! Something goes wrong. Try again later!'})
  }
  res.send(myEndPoints(app))
})
//API endpoints for books with query options for author, title; otherwise, display 20 data per page (sorted by average_rating) and allow user to request for more pages
app.get('/books', async (req, res) => {
  const { title, author } = req.query

  const queryTitleRegex = new RegExp(title, 'i')
  const queryAuthorRegex = new RegExp(author, 'i')

  if (title && author) {
    const books = await Book.find({ title: queryTitleRegex, authors:queryAuthorRegex })
    const returnObj = {
      filterByTitle: title,
      filterByAuthor: author,
      amountOfData: books.length,
      results: books
    }
    res.json(returnObj)
  } else if (title) {
    const books = await Book.find({ title: queryTitleRegex }).sort({ average_rating: -1 })
    const returnObj = {
      filterByTitle: title,
      amountOfData: books.length,
      results: books
    }
    res.json(returnObj)
  } else if (author) {
    const books = await Book.find({ authors: queryAuthorRegex }).sort({ average_rating: -1})
    const returnObj = {
      filterByAuthor: author,
      amountOfData: books.length,
      results: books
    }
    res.json(returnObj)
  } else {
    const { page } = req.query
    const pageSize = 20
    const skipData = page ? page * pageSize : 0;
    
    const amountOfData = await Book.find().count()
    const totalNumberOfPage = Math.ceil(amountOfData / pageSize)
    
    let returnObj = {
      totalAmountOfData: amountOfData,
      totalNumberOfPage: totalNumberOfPage,
      pageSize: pageSize,
      currentPage: page || 1,
      results: []
    }

    const books = await Book.find()
      .sort({ average_rating: -1 })
      .skip(skipData)
      .limit(pageSize)
    
    if (!books.length) {
      res.json({ error: 'Oops! Page not found'})
    } else {
      res.json({
        ...returnObj,
        results: books
      })
    }
  }
})
// filter book by Id using findById() function and handling error
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params)
    if (book) {
      res.json(book)
    } else {
      res.status(404).json({ error: `Can not find book with id ${id}`})
    }
  } catch (err) {
    res.status(400).json({ error: `${id} is a invalid book id`})
  }
})

//filter books by isbn with findOne() function and handling error

app.get('/books/isbn/:isbn', async (req, res) => {
  try {
    const book = await Book.findOne(req.params)
    if (book) {
    res.json(book)
    } else {
    res.status(404).json({ error: `Book with isbn ${isbn} can not be found`})
    }
  } catch (err) {
    res.status(400).json({ error: `${isbn} is an invalid isbn`})
  }
})

//APIs BELOW IS TO PRACTISE MONGODB AGGREGATE FUNCTIONS

//sort and group books by language. If there is no lang query, group the data by language, authors and titles
app.get('/books/language/search', async (req, res) => {
  try {
    const { lang } = req.query
    if (lang) {
      const books = await Book.aggregate([
        { $match: { language_code: lang}},
        { $sort: {title: 1}}
      ])
      const returnObj = {
        amountOfData: books.length,
        results: books
      }
      res.json(returnObj)
    } else {
    //If there is no query in the language search, then group books by language, author and title. Then, sort authors ascedingly and sort title ascendingly
      const books = await Book.aggregate([
        { $group: {_id: {
          language: "$language_code", 
          authors: "$authors", 
          title: "$title"
        }}},
        { $sort: {"_id.authors": 1, "_id.title": 1}}
      ]
      //   {allowDiskUse: true} //this line is to enable MongoDB to use temporary memory in case the stage exceed limited RAM, mainly for practising mongoDB stage, not necessary for the small size data of this project.
      )
      const returnObj = {
        amountOfData: books.length,
        results: books
      }
      res.json(returnObj)
    }
  } catch (err) {
    res.status(400).json({ error: 'Data not found'})
  }
})
//CREATE NEW COLLECTION OF TOP 40 ENGLISH BOOK


//create new API endpoints to printout top 40 English book from new collection
app.get('/top40rating/english', async (req, res) => {
  try {
    const top40EngBooks = await Book.aggregate([
      { $match: {language_code: { $in: ['eng', 'en-GB', 'en-US']}}},
      { $project: {
        _id: 0,
        isbn: 0,
        isbn13: 0,
        language_code: 0,
        ratings_count: 0,
        text_reviews_count: 0,
        __v: 0
      }},
      { $sort: {average_rating: -1, authors: 1}},
      { $limit: 40},
      { $out: 'top40EngBook'}//this function is to split the new set of data into a new collection called 'top40EngBook'
    ])
    //these codes are mostly to practise the way to access the new collection 'top40EngBook'. The whole API maybe not semantically correct, just purely for practising purpose.
    mongoose.connection.db.collections('top40EngBook',async (error, collections) => {
      const results= await collections[1].find().toArray(function(err, data){
        const returnObj = {
          amountOfData: data.length,
          results: data
        }  
        res.json(returnObj)
      })
    })
  } catch (err) {
    res.status(400).json({ error: 'Data not found'})
  }
})

//this API is created from a new collection 'top40EngBook', not from the book collection.
app.get('/newcollection', async(req, res) => {
  mongoose.connection.db.collections('top40EngBook',async (error, collections) => {
    const results= await collections[1].find().toArray((err, data) => {
    res.json(data)
    })
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})