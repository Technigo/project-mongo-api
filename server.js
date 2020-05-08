import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import data from './data/books.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

const Books = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Books.deleteMany()

    data.forEach((book) => {
      new Books(book).save()
    })
  }
  seedDatabase()
}

// Start defining your routes here

app.get('/', (req, res) => {
  res.send('try visiting /books')
})


app.get('/books', (req, res) => {
  Books.find().then(books => {
    let orderedBooks = books
    const keyword = req.query.keyword
    const order = req.query.order
    const PAGE_SIZE = 20
    const page = +req.query.page || 1
    let selectedPage = orderedBooks.slice((page * PAGE_SIZE) - PAGE_SIZE, page * PAGE_SIZE)
    if (keyword) {
      if (order === 'highest') {
        orderedBooks = orderedBooks.sort((a, b) => (a.average_rating > b.average_rating) ? -1 : 1)

      } else if (order === 'lowest') {
        orderedBooks = orderedBooks.sort((a, b) => (a.average_rating > b.average_rating) ? 1 : -1)

      } else if (order === 'longest') {
        orderedBooks = orderedBooks.sort((a, b) => (a.num_pages > b.num_pages) ? -1 : 1)

      } else if (order === 'shortest') {
        orderedBooks = orderedBooks.sort((a, b) => (a.num_pages > b.num_pages) ? 1 : -1)

      } else {
        orderedBooks = orderedBooks.sort((a, b) => (a.bookID > b.bookID) ? 1 : -1)
      }
      const firstResult = orderedBooks.filter((book) => book.authors.toLowerCase().replace(/ /gi, '_').includes(keyword))
      const secondResult = orderedBooks.filter((book) => {

        if (book.title.toString().toLowerCase().replace(/ /gi, '_').includes(keyword) && firstResult.indexOf(book) === -1) {
          return true
        } else {
          return false
        }
      })

      const finalResult = firstResult.concat(secondResult)
      selectedPage = finalResult.slice((page * PAGE_SIZE) - PAGE_SIZE, page * PAGE_SIZE)
      res.json(selectedPage)
    } else if (order === 'highest') {
      orderedBooks = orderedBooks.sort((a, b) => (a.average_rating > b.average_rating) ? -1 : 1)
      selectedPage = orderedBooks.slice((page * PAGE_SIZE) - PAGE_SIZE, page * PAGE_SIZE)
      res.json(selectedPage)
    } else if (order === 'lowest') {
      orderedBooks = orderedBooks.sort((a, b) => (a.average_rating > b.average_rating) ? 1 : -1)
      selectedPage = orderedBooks.slice((page * PAGE_SIZE) - PAGE_SIZE, page * PAGE_SIZE)
      res.json(selectedPage)
    } else if (order === 'longest') {
      orderedBooks = orderedBooks.sort((a, b) => (a.num_pages > b.num_pages) ? -1 : 1)
      selectedPage = orderedBooks.slice((page * PAGE_SIZE) - PAGE_SIZE, page * PAGE_SIZE)
      res.json(selectedPage)
    } else if (order === 'shortest') {
      orderedBooks = orderedBooks.sort((a, b) => (a.num_pages > b.num_pages) ? 1 : -1)
      selectedPage = orderedBooks.slice((page * PAGE_SIZE) - PAGE_SIZE, page * PAGE_SIZE)
      res.json(selectedPage)
    } else {
      orderedBooks = orderedBooks.sort((a, b) => (a.bookID > b.bookID) ? 1 : -1)
      selectedPage = orderedBooks.slice((page * PAGE_SIZE) - PAGE_SIZE, page * PAGE_SIZE)
      res.json(selectedPage)
    }

  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
