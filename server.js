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
  const { title, author, language, page } = req.query
  const pageNumber = +page || 1 //why does ?page=0 console logged out as 1? 
  console.log(pageNumber)
  /* is line 87 is shorthand for: ?????
  https://www.sitepoint.com/shorthand-javascript-techniques/
  
  if (page !== null || page !== undefined || page !== '') {
     let variable2 = page;
  }

  const variable2 = page || 'new';

  */

  const pageSize = 20
  const skip = pageSize * (pageNumber -1)

  //första authors = definering i modell , author = query parameter.
  let books = await Book.find({
    title: new RegExp(title, 'i'),
    authors: new RegExp(author, 'i'),
    language_code: new RegExp(language, 'i')
  })
    .sort({ average_rating: - 1 }) //hard coded to sort data accordingly to this.
    .limit(pageSize)
    .skip(skip)


  if (books) {
    res.json({ currentPage: pageNumber, pageSize: pageSize, skip: skip, results: books })
  } else {
    res.status(404).send({ error: "No books found"})
  }
})

//____________Single book
app.get('/books/:id', async (req, res) => {
  const { id } = req.params;

  try {
  const singleBook = await Book.findOne({ bookID: id });
    if (singleBook) {
      res.json(singleBook);
    } else res.status(404).send({ error: `No book with id: ${id} found.` });
  } catch {
    res.status(400).send({ error: `${id} is not a valid bookID`})
  }
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