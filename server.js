import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
import booksData from './data/books.json';
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Mongoose models
const Book = mongoose.model('Book', {
  title: String,
  bookID: Number,
  isbn: Number,
  average_rating: Number,

  // Tells the server that this relates to the Author model id
  authors: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Authors'
  }
});

const Authors = mongoose.model('Authors', {
  authors: String
});

// To make it run only when we want to
if (process.env.RESET_DATABASE) {
  console.log('Resetting database!');
  const seedDatabase = async () => {
    // To not get several same responses, start with deleting what's already there
    await Book.deleteMany();
    await Authors.deleteMany();

    await booksData.forEach((book) => new Book(book).save());
    await booksData.forEach((book) => new Authors(book.authors).save());

    seedDatabase();
  }
}

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Middleware to handle connection errors
app.use((req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      next()
    } else {
      res.status(503).json({ error: 'Service unavailable' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid something...' });
  }
});

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Books API created by Gabriella Bolin');
});

// RESTroute to return all authors
app.get('/authors', async (req, res) => {
  try {
    const authors = await Author.find();
    if (authors) {
      res.json(authors);
    } else {
      // Error handling
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid author id' });
  }
});

// To return that choosen bookID for an author
app.get('authors/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (author) {
      res.json(author);
    } else {
      // Error handling
      res.status(404).json({ error: 'Author not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid author id' });
  }
});

// To return books for a particular author
app.get('/authors/:id/books', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (author) {
      const books = await Book.find({ author: mongoose.Types.ObjectId(author.id) });
      res.json(books);
    } else {
      // Error handling
      res.status(404).json({ error: 'Author not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid author id' });
  }
});

// To return all books
app.get('/books', async (req, res) => {
  // Possibility to search on title with query params
  const { query } = req.query; // Same as writing const query = req.params.query;
  const queryRegex = new RegExp(query, 'i');
  const books = await Book.find({ title: queryRegex }).sort({
    average_rating: -1,
  }).populate('authors');
  console.log(books[0].authors)
  if (books) {
    res.json(books);
  } else {
    // Error handling
    res.status(404).json({ error: 'Data not found' });
  }
});

// To return books with particular ID
// app.get('/books/:id', async (req, res) => {
//   try {
//     const Book = await Book.findById(req.params.id)
//     if (book) {
//       res.json(book);
//     } else {
//       // Error handling
//       res.status(404).json({ error: 'Book not found' });
//     }
//   } catch (err) {
//     res.status(400).json({ error: 'Invalid book id' });
//   }
// });

// To return book by it's ISBN
app.get('/books/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    const book = await Book.findOne({ isbn: isbn });
    if (book) {
      res.json(book);
    } else {
      // Error handling
      res.status(404).json({ error: `Book with isbn: ${isbn} could not be found!` });
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid author id' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
