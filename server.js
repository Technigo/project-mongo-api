import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import booksData from "./data/books.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo-kolkri"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//our own middleware that checks if the database is connected before going to our endpoints
// app.use((req, res, next) => {
//   if (mongoose.connection.readyState === 1){
//     next()
//   } else {
//     res.status(503).json({error: 'Service unavailable'})
//   }
// })

const Book = mongoose.model('Book', {
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


// Function to start seeding our Database, will only run if
// RESET_DB environment variable is present and is true
if(process.env.RESET_DB){
  const seedDatabase = async () => {
    await Book.deleteMany({})
    booksData.forEach(item => {
      const newBook = new Book(item)
      newBook.save()
    })
  }
  seedDatabase()
}



//second endpoint to get all books
app.get('/books', async (req,res) => {
  const booksToShow = await Book.find({})
  res.json(booksToShow)
})

//get one book based on id
app.get('/books/id/:id', async (req, res) => {
try{
  const bookById =  await Book.findById(req.params.id)
  if(bookById) {
    res.status(200).json({response: bookById, success:true})
  } else {
    res.status(404).json({response: 'Book not found!', success:false})
  }
} catch(err) {
  res.status(400).json({response: 'Error!', success:false})
}

})

//get the books based on rating
app.get('/books/rating', async (req, res) => {
  let booksToShow = await Book.find(req.query)

  //books with rating greater than given value
  if (req.query.average_rating) {
    const booksByRating= await Book.find().gt(
      'average_rating',
      req.query.average_rating
    )
    booksToShow = booksByRating
  }

  res.json(booksToShow)
})

// Start defining your routes here
  app.get("/", (req, res) => {
    res.json({
      message: 'This is API for book data endpoints',
      data: listEndpoints(app)
    })
});



// //get data by book's name and author using query parameters
app.get("/books", (req, res) => {
  const {bookName, bookAuthor} = req.query
  let booksToSend = booksData

  if(bookName) {
    booksToSend = booksData.filter((item) => item.title.toLowerCase().indexOf(bookName.toLowerCase()) !== -1)
  }

  if(bookAuthor) {
    booksToSend = booksToSend.filter((item) => item.authors.toLowerCase().indexOf(bookAuthor.toLowerCase()) !== -1)
  }

  res.json({
    response: booksToSend,
    success:true
  })
  
});

// //get book data by id
app.get('/books/id/:bookID', (req, res) => {
  const { bookID } = req.params;
  console.log(req)
  const bookById = booksData.find((item) => item.bookID === +bookID);

  if (!bookById) {
    res.status(404).send('No book found!')
  };
  
  res.json(bookById);
})

//get bbok data by name
app.get('/books/name/:bookName', (req, res) => {
  const { bookName } = req.params
  const bookByName = booksData.find((item) => item.title.toLowerCase() === bookName.toLowerCase())

  if(!bookName) {
    res.status(404).json({
      response: 'No book found with that name',
      success: false
    }) 
  } else {
    res.status(200).json({
      response: bookByName,
      success: true
    }) 
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});