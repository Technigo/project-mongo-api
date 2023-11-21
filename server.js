import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import listEndpoints from 'express-list-endpoints';
import Book from './models/book';
import booksData from './data/books.json'; 

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/8080";
const connectWithRetry = () => {
  mongoose
    .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('MongoDB connected');
      mongoose.set('strictQuery', false); // Set strictQuery option to false
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    });
};

// Call the connection function
connectWithRetry();

mongoose.Promise = Promise;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  const endpoints = listEndpoints(app);
  res.json({ endpoints });
});

app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/books/:id', async (req, res) => {
  const { id } = req.params;
  const book = await Book.findOne({ bookID: id });

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

app.post('/books', async (req, res) => {
  const newBook = new Book(req.body); // Ensure body contains the required fields
  try {
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Data Seeding
const seedDatabase = async () => {
  await Book.deleteMany({}); // Clears the existing books collection

  for (const bookData of booksData) {
    const newBook = new Book(bookData);
    try {
      await newBook.save();
    } catch (error) {
      console.error('Error seeding book:', error);
    }
  }

  console.log('Database has been seeded!');
};

seedDatabase().then(() => {
  mongoose.connection.close();
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
