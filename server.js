import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { endpoints } from 'express-list-endpoints';
import booksData from "./data/books.json";

// Mongoose models
const Book = mongoose.model('Book', {
  title: String,
  author: String,
  genre: String,
  publishDate: Date,
});

const Author = mongoose.model('Author', {
  name: String,
  nationality: String,
  birthDate: Date,
});

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Insert booksData into MongoDB on startup
const insertBooksData = async () => {
  try {
    await Book.insertMany(booksData);
    console.log('Books data inserted into MongoDB');
  } catch (error) {
    console.error('Error inserting books data:', error);
  }
};

insertBooksData(); // Call the function to insert data

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
  res.send("Hello Technigo!");
});

// Documentation route
app.get("/", (req, res) => {
  const routes = endpoints(app);
  res.json(routes);
});

// Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single book by ID
app.get('/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
