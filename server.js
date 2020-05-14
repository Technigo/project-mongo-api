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
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})



const Book = mongoose.model('Book', {
  bookID: Number,
  title: {
    type: String

  },
  authors: String,
  average_rating: {
    type: Number,
    default: 0,
  },
  num_pages: {
    type: Number,
    default: 0
  },
  ratings_count: {
    type: Number,
    default: 0
  },
  text_reviews_count: {
    type: Number,
    default: 0
  },
  img_url: {
    type: String,
    default: ''
  }
})

const User = mongoose.model('User', {
  username: {
    type: String,
    minlength: 3,
    maxlength: 20
  },
  password: {
    type: String,
    minlength: 8
  },
  ratings: {
    type: Array,
    default: []
  },
  profilePicture: {
    type: String,
    default: ''
  }
})


const createRandomBook = async (num, titlesArray, authorArray) => {
  await Book.deleteMany()
  const arr = Array.apply(null, Array(num))

  arr.forEach((val, index) => {
    new Book({
      bookID: index,
      title: titlesArray[parseInt(titlesArray.length * Math.random())],
      authors: authorArray[parseInt(authorArray.length * Math.random())],
      num_pages: parseInt(Math.random() * 2000),
      ratings_count: parseInt(Math.random() * 10000),
      average_rating: (Math.random() * 5).toFixed(2)

    }).save()
  })


}
if (process.env.SEED_RANDOM) {
  const generateRandomBooks = () => {
    const bookTitles = []
    const authors = []
    data.forEach((book) => bookTitles.push(book.title))
    data.forEach((book) => {
      if (!authors.includes(book.authors.split('-')[0])) {
        authors.push(book.authors.split('-')[0])
      }
    })
    createRandomBook(500, bookTitles, authors)
  }
  generateRandomBooks()
}

// if (process.env.RESET_DB) {
//   const seedDatabase = async () => {
//     await Book.deleteMany()

//     data.forEach((book) => {
//       new Book(book).save()
//     })
//   }
//   seedDatabase()
// }


app.get('/', (req, res) => {
  res.json({
    homepage: '/books',
    queryOrder: '?order=highest, lowest, longest, shortest',
    queryKeyword: '?keyword=an author or title',
    queryPage: '?page=1,2,3,4...',
    individualBook: '/books/1,2,3,4...',
    keywordResultsCanBeOrdered: 'true'
  })
})



app.get('/books', async (req, res) => {
  const keyword = req.query.keyword
  const keyRegExp = new RegExp('\\b' + keyword + '\\b', 'i')
  const order = req.query.order
  const page = +req.query.page || 1
  const PAGE_SIZE = 20
  let mySort = order === 'highest' ? { average_rating: -1 } : order === 'lowest' ? { average_rating: 1 }
    : order === 'longest' ? { num_pages: -1 } : order === 'shortest' ? { num_pages: 1 } : { bookID: 1 }

  if (keyword) {
    const books = await Book.find({ $or: [{ title: keyRegExp }, { authors: keyRegExp }] }).sort(mySort).limit(PAGE_SIZE).skip((page * PAGE_SIZE) - PAGE_SIZE)
    console.log(keyRegExp)
    if (books.length > 0) {
      res.json(books)
    } else {
      res.status(404).json({ error: `No books or authors in the database match the keyword '${keyword}'` })
    }

  } else {
    const books = await Book.find().sort(mySort).limit(PAGE_SIZE).skip((page * PAGE_SIZE) - PAGE_SIZE)
    res.json(books)
  }
})

app.get('/books/:id', async (req, res) => {
  const foundBook = await Book.findOne({ bookID: req.params.id })
  if (foundBook) {
    res.json(foundBook)
  } else {
    res.status(404).json({ error: `No book with id "${req.params.id}" exists.` })
  }
})

app.put('/books/:id', async (req, res) => {

  const foundBook = await Book.findOne({ bookID: req.params.id })

  const setRating = (user_rating) => {
    const totalRating = (foundBook.average_rating * foundBook.ratings_count) + user_rating
    const totalNumber = foundBook.ratings_count + 1
    const average = totalRating / totalNumber
    return Math.round((average + Number.EPSILON) * 100) / 100
  }

  const updatedBook = await Book.findOneAndUpdate({ bookID: +req.params.id }, {
    img_url: req.body.img_url ?? foundBook.img_url,
    average_rating: req.body.user_rating ? setRating(+req.body.user_rating) : foundBook.average_rating,
    ratings_count: req.body.user_rating ? foundBook.ratings_count + 1 : foundBook.ratings_count
  }, { new: true })
  res.json(updatedBook)
})

app.post('/addbook', async (req, res) => {

  const allBooks = await Book.find()
  const getLastId = allBooks.sort((a, b) => (a.bookID > b.bookID) ? 1 : -1)

  new Book(
    {
      bookID: getLastId[getLastId.length - 1].bookID + 1,
      title: req.body.title,
      authors: req.body.author,
      img_url: req.body.image ?? '',
      num_pages: req.body.pages ?? 0

    }
  ).save()
  res.send('book saved')
})

//Below is some code I began expirimenting with for my front-end but which I decided to put
//aside for time being as it would have taken too long to get it all working. (And I'm not sure)
//if this is really how users would actually be created for a real website. 

app.post('/createuser', async (req, res) => {

  const existingUser = await User.findOne({ username: req.body.username })

  if (!existingUser) {
    new User(
      {
        username: req.body.username,
        password: req.body.password,
      }
    ).save()
    res.send('User created')
  } else {
    res.json({ error: 'That username already exists.' })
  }
})

app.post('/login', async (req, res) => {
  const existingUser = await User.findOne({ password: req.body.password, username: req.body.username })
  if (existingUser) {
    res.json(existingUser)
  } else {
    res.json({ error: 'Invalid password or username' })
  }

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
