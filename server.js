import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import booksData from "./data/books.json";
import { redirect } from "express/lib/response";

// import avocadoSalesData from "./data/avocado-sales.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

//Mongoose model
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

//Loop through data set. Async in order to avoid duplication. 
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany() 
    booksData.forEach(singleBook => {
      const newBook = new Book(singleBook)
      newBook.save()
    })
  }
  seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
    app.get('/', (req, res) => {
      res.send(
        {"Welcome":"This is the ultimate API source for book reviews!",
          "Routes": [{"/books":"All books available","/books/id/:bookID":"Get one specific book based on its bookID","/books/author/:authors":"Get all books written by a specific author","/books/language/:language_code":"Get all books written in a specific language"}]}
      )
    })


//All books available
app.get('/books', (req, res) => {
  Book.find().then(books => {
    res.json(books)
  })
})

 //Endpoint that returns a single book by a specific bookID
app.get("/books/id/:bookID", async (req, res) => {
try {
  const bookById=await Book.findOne({bookID: req.params.bookID})
if(bookById) {
  res.status(200).json({
    data: bookById,
    success: true,
  })
} else {
  res.status(404).json({
    error: 'No book with that bookID was found.',
    success: false,
  })
}
} catch (err) {
  res.status(400).json({
    error: 'Invalid bookID',
    success: false,
  })
}
})

 //Endpoint that returns all books written by a specific author
  app.get("/books/author/:authors", async (req, res) => {
    const bookByAuthor=await Book.find({authors: req.params.authors});
    if (bookByAuthor.length===0) {
      res.status(400).json({
        data: "There are no books available by this author here.",
        success: false,
      });
    } else {
      res.status(200).json({
        data: bookByAuthor,
        sucess: true,
      });
    }
  });


 //Endpoint that returns all books written in specific language (based on language code with three letters)
 app.get("/books/language/:language_code", async (req, res) => {
  const bookByLanguage=await Book.find({language_code: req.params.language_code});
  if (bookByLanguage.length===0) {
    res.status(400).json({
      data: "No books written in that language are available here.",
      success: false,
    });
  } else {
    res.status(200).json({
      data: bookByLanguage,
      sucess: true,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
