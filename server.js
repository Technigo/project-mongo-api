import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/bookCollection"
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
    lenght: 3
    //How to put the validation of string of 3 character here
    //How to print out error message if data input was not aligned
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
    await booksData.forEach((book) => new Book(book).save())
    //Why await does not have any impact on this function???
  }
  seedDatabase()
}

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable'})
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/books', async (req, res) => {
  //How to simplify these codes
  const { title, author } = req.query

  const queryTitleRegex = new RegExp(title, 'i')
  const queryAuthorRegex = new RegExp(author, 'i')

  if (title) {
    const books = await Book.find({ title: queryTitleRegex }).sort({ average_rating: -1 })
    const returnObj = {
      filterby: title,
      amountOfData: books.length,
      results: books
    }
    res.json(returnObj)
  } else if (author) {
    const books = await Book.find({ authors: queryAuthorRegex }).sort({ average_rating: -1})
    const returnObj = {
      filterBy: author,
      amountOfData: books.length,
      results: books
    }
    res.json(returnObj)
  } else {
    const { page } = req.query
    const pageSize = 20
    const skipData = page * pageSize
    const amountOfData = await Book.find().count()
    const totalNumberOfPage = Math.ceil(amountOfData / pageSize)
    let returnObj = {
      totalAmountOfData: amountOfData,
      totalNumberOfPage: totalNumberOfPage,
      pageSize: pageSize
    }
    if (!page || page === 0) {
      const books = await Book.find()
        .sort({ average_rating: -1})
        .limit(pageSize)
      returnObj = {
        ...returnObj,
        currentPage: 1,
        results: books
      }
      res.json(returnObj)
    } else if (page > 0) {
      const books = await Book.find()
        .sort({ average_rating: -1})
        .skip(skipData)
        .limit(pageSize)
      returnObj = {
        ...returnObj,
        currentPage: page,
        results: books
      }
      res.json(returnObj)
    } else {
      res.json({ error: 'Oops! Page not found'})
    }
  }
})

app.get('/books/:id', async (req, res) => {
  const { id } = req.params
  try {
    const book = await Book.findById(id)
    if (book) {
      res.json(book)
    } else {
      res.status(404).json({ error: `Can not find book with id ${id}`})
    }
  } catch (err) {
    res.status(400).json({ error: `${id} is a invalid book id`})
  }
})

app.get('/books/:isbn', async (req, res) => {
  const { isbn } = req.params
  try {
    const book = await Book.findOne({ isbn: isbn })
    if (book) {
    res.json(book)
    } else {
    res.status(404).json({ error: `Book with isbn ${isbn} can not be found`})
    }
  } catch (err) {
    res.status(400).json({ error: `${isbn} is an invalid isbn`})
  }
})

//API below is to try using MongoDB's aggregate function
//sort and group books by language

app.get('/books/language/search', async (req, res) => {
  const { lang } = req.query
  if (lang) {
    const books = await Book.aggregate([
      { $match: { language_code: lang} }
    ]).sort({ average_rating: -1})
    const returnObj = {
      amountOfData: books.length,
      results: books
    }
    res.json(returnObj)
  } else {
    const books = await Book.aggregate([
      { $group: {_id: {language: "$language_code", authors: "$authors", title: "$title"}}}
    ])
    const returnObj = {
      amountOfData: books.length,
      results: books
    }
    res.json(returnObj)
  }
})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
