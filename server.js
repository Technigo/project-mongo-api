import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
//import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//_____________create my modules
//model is a method /function function that takes two argument
//Member in this case and second argument an object = blueprint
//the object is called schema - new instances of modules
//DOCUMENTATION https://mongoosejs.com/docs/
const Book = mongoose.model('Book', {
  bookID: {
    type: Number,
  },
  title: {
    type: String,
  },
  authors: {
    type: String,
  },
  average_rating: {
    type: Number,
  },
  isbn: {
    type: String,
  },
  isbn13: {
    type: String,
  },
  language_code: {
    type: String,
  },
  num_pages: {
    type: Number,
  },
  ratings_count: {
    type: Number,
  },
  text_reviews_count: {
    type: Number,
  },
});

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Book.deleteMany() //clear database
    await booksData.forEach((item) => new Book(item).save()) //single object from json array
  }
  seedDatabase()
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

//____________to get an error message if server is down
// 1 === connected 0,2,3 not connected
app.use((req, res, next) => {
  if(mongoose.connection.readyState === 1) {
    next() //to execute next get response
  } else {
    res.status(503).send({ error: "service unavailable"})
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

//______________All books
app.get('/books', async (req, res) => {
  const books = await Book.find()
  console.log(`get books ${books}`)

//sort by rating
// if(sort === "rating_dsc") {
//   booksList = booksList.sort((a, b) => (b.average_rating - a.average_rating));
// } else if (sort === "rating_asc") {
//   booksList = booksList.sort((a, b) => (a.average_rating - b.average_rating));
// };

//filter by author
if (author) {
  booksList = booksList.filter((item) => item.authors.toString().toLowerCase().includes(author.toLowerCase()));
};

//filter by title
if (title) {
  booksList = booksList.filter((item) => item.title.toString().toLowerCase().includes(title.toLowerCase()));
};


  if (books) {
    res.json(books)
  } else {
    res.status(404).send({ error: "No books found"})
  }
})

//____________Single book 
// /books/:id endpoint
// RETURNS: A single book by id from books.json
app.get('/books/:id', async (req, res) => {
  const { id } = req.params;
  const singleBook = await Book.findOne({ bookID: id });
  if (singleBook) {
    res.json(singleBook);
  } else res.status(404).send({ error: `No book with id: ${id} found.` });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

//npm install @babel/helper-compilation-targets 
// INCASE PROBLEM STARTING NPM RUN DEV

//testa felmeddelandet starta
//brew services start mongodb-community@4.4 
//brew services stop mongodb-community@4.4 