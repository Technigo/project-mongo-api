import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import booksData from './data/books.json';
import listEndpoints from 'express-list-endpoints';
import Book from './models/book'; // Adjust the path to your Book model

dotenv.config()


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    mongoose.set('strictQuery', false); // Set strictQuery option to false
  })
  .catch(err => console.error('MongoDB connection error:', err));

mongoose.Promise = Promise;



// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  const endpoints = listEndpoints(app);
  res.json({ endpoints });
});


// Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single book by bookID
app.get('/books/:id', async (req, res) => {
  const { id } = req.params;
  const book = await Book.findOne({ bookID: id });

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

// Add a new book
app.post('/books', async (req, res) => {
  const newBook = new Book(req.body); // Ensure body contains the required fields
  try {
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
