import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from 'express-list-endpoints'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err))
mongoose.Promise = Promise;

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

if (process.env.RESET_DATABASE == 'true') {
  const seedDatabase = async () => {
    await Book.deleteMany({})

    // booksData.forEach((bookData) => {
    //   new Book(bookData).save()
    // })

    await Promise.all(booksData.map(bookData => new Book(bookData).save()))
  }

  seedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});

app.get('/books', async (req, res) => {
  try {
    const books = await Book.find()
    res.json(books)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/books/:id', async (req, res) => {
  // const id = req.params.id
  // const book = booksData.find(b => b.bookID == id) // find book with id

  
  try {
    const book = await Book.findById(req.params.id)
    if (book) {
      res.json(book)
    } else {
      res.status(404).send('there is no such thing like that')
    }
  } catch (error) {
    
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
