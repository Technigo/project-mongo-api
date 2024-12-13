import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import booksData from "./data/books.json";
import dotenv from "dotenv";

dotenv.config()

// Connecting to MongoDB
// const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/books'
const mongoURI = process.env.MONGODB_URI

mongoose.connect(mongoURI)

  .then(() => {
  console.log('MongoDB successfully connected!')
  })
  .catch((error) => {
  console.error('Error to connect with MongoDB', error)
  })

// Setting a book schema and model
const Book = mongoose.model('Book', new mongoose.Schema({
  title: String,
  authors: String,
  isbn: Number,
  language_code: String,
  num_pages: Number
}));

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

if (process.env.RESET_DB)  {
    const seedDatabase = async () => {
        await Book.deleteMany({}); 
        booksData.forEach(book => {
          new Book(book).save()
        })
      }
    seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Route to get books
app.get('/books', async (req, res) => {
try {
  const books = await Book.find()
  res.json(books)
}catch (error) {
  console.error('Error retrieving books', error);
    res.status(500).send('Server error');
}
});

// Route to get books by author
app.get('/books/author/:author', async (req, res) => {
  const { author } = req.params;  // Get the author from the URL parameter
  try {
    const books = await Book.find({ authors: new RegExp(author, 'i') });  // Find books by author (case insensitive)
    if (books.length === 0) {
      return res.status(404).send('No books found for this author');
    }
    res.json(books);
  } catch (error) {
    console.error('Error retrieving books by author', error);
    res.status(500).send('Server error');
  }
});

app.get('/books/title/:title', async (req, res) => {
  const { title } = req.params;  // Get the title from the URL parameter
  try {
    const book = await Book.findOne({ title: title });  // Query the book by title
    if (!book) {
      return res.status(404).send('Book not found');  // If no book is found, return 404
    }
    res.json(book);  // Send the book as a JSON response
  } catch (error) {
    console.error('Error retrieving book', error);
    res.status(500).send('Server error');
  }
});

// Route to get books by isbn
app.get('/books/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
    const book = await Book.findOne({ isbn: isbn });
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.json(book);
  } catch (error) {
    console.error('Error retrieving book by ISBN', error);
    res.status(500).send('Server error');
  }
});

// Route to get books by language
app.get('/books/language/:language', async (req, res) => {
  const { language } = req.params;
  try {
    const books = await Book.find({ language_code: language });
    if (books.length === 0) {
      return res.status(404).send('No books found for this language');
    }
    res.json(books);
  } catch (error) {
    console.error('Error retrieving books by language', error);
    res.status(500).send('Server error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
