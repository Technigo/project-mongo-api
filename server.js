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

const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
  img_url: {
    type: String,
    default: ''
  }
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany()

    data.forEach((book) => {
      new Book(book).save()
    })
  }
  seedDatabase()
}

// Start defining your routes here

app.get('/', (req, res) => {
  res.send('try visiting /books')
})

/*I was able to use .limit and .skip to limit initial Books.find() like so:
const page = +req.query.page || 1
const PAGE_SIZE = 20
Books.find().limit(PAGE_SIZE).skip((page * PAGE_SIZE) - PAGE_SIZE)
But I couldn't implement this with my orderedBooks variable, since I was only finding 20 books at a time
my sort function would just order those 20 books. Changing to next page would find the next 20 books as they
appear in database and sort those, etc. It seems like I need to be finding all the books at once so I can order 
them properly..*/

app.get('/books', (req, res) => {

  Book.find().then(books => {
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
      const firstResult = orderedBooks.filter((book) => book.authors.toLowerCase().replace(/ /gi, '_').includes(keyword.toLowerCase().replace(/ /g, '_')))
      const secondResult = orderedBooks.filter((book) => {

        if (book.title.toString().toLowerCase().replace(/ /gi, '_').includes(keyword.toLowerCase().replace(/ /g, '_')) && firstResult.indexOf(book) === -1) {
          return true
        } else {
          return false
        }
      })

      const finalResult = firstResult.concat(secondResult)
      if (finalResult.length > 0) {
        selectedPage = finalResult.slice((page * PAGE_SIZE) - PAGE_SIZE, page * PAGE_SIZE)
        res.json(selectedPage)
      } else {
        res.json({ error: `The keyword "${keyword}" does not match any book or author in the database.` })
      }

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

app.put('/books/:id', async (req, res) => {

  //const updatedBook = await Book.findOneAndUpdate({ bookID: +req.params.id }, { img_url: req.body.img_url }, { new: true })
  res.json(req.body.img_url)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
