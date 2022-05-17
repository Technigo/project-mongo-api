import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocad§o-sales.json";
import booksData from "./data/books.json";
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

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const Book = mongoose.model("Book", {
  bookID: String,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({});
    booksData.forEach(item => {
      const newBook = new Book(item);
      newBook.save();
    })
  };
  seedDatabase();
}

app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

app.get("/books/book/", async (req, res) => {
  const {title, authors} = req.query;
  const myRegex = /.*/gm

  if (title && authors != undefined) {
    const secondBook = await Book.find({
      title: title ? title : myRegex,
      authors: authors ? authors : myRegex})
    res.send(secondBook);
  } else {
    const secondBook = await Book.find({
      title: title})
    res.send(secondBook);
  }
});

//All books
app.get('/books', async (req, res) => {
  const allBooks = await Book.find()
  res.send(allBooks)
  })

//Sort on title
app.get("/books/book/:title", async (req, res) => {
  const booksByTitle = await Book.find({title: req.params.title})
  res.send(booksByTitle)
});

//Sort on authors
app.get("/books/book/:authors", async (req, res) => {
  const booksByAuthors = await Book.find({authors: req.params.authors})
  res.send(booksByAuthors)
});

// Sorts out the book with the most amout of pages.
app.get("/books/num_pages/max", async (req, res) => {
  const booksByMaxPages = await Book.find().sort({num_pages:-1}).limit(1)
  res.send(booksByMaxPages[0])
})

// Sorts out the book with the least amout of pages.
app.get("/books/num_pages/min", async (req, res) => {
  const booksByMinPages = await Book.find().sort({num_pages:+1}).limit(1)
  res.send(booksByMinPages[0])
})

// Sorts out the book with the least amout of pages.
app.get("/books/average_rating", async (req, res) => {
  const booksByRating = await Book.find().sort( { average_rating:[-1] } )
  res.send(booksByRating)
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
