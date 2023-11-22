import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import listEndpoints from 'express-list-endpoints';
import Book from './models/book';
import booksData from './data/books.json'; 

dotenv.config();

// MongoDB Connection with retry logic
const mongoUrl = process.env.MONGO_URL || "project-mongo";
const connectWithRetry = () => {
  mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
      console.error('MongoDB connection error:', err);
      setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    });
};

connectWithRetry();

mongoose.Promise = Promise;
mongoose.set('strictQuery', true); // Address the deprecation warning

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.json({ endpoints: listEndpoints(app) });
});

// Books routes
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ bookID: req.params.id });
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/books', async (req, res) => {
  const newBook = new Book(req.body);
  try {
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Error saving new book:', error);
    res.status(400).json({ error: error.message });
  }
});

// Seed the database (execute cautiously)
if (process.env.RESET_DB === 'true') {
  seedDatabase();
}

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Function to seed the database with error handling
async function seedDatabase() {
  try {
    await Book.deleteMany({});
    await Promise.all(booksData.map(async (bookData) => {
      const newBook = new Book(bookData);
      await newBook.save();
    }));
    console.log('Database has been seeded!');
  } catch (err) {
    console.error('Error during database seeding:', err);
  }
}
