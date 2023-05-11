import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1/books';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
});

const Author = mongoose.model('Author', {
  name: String
});

if (process.env.RESET_DB) {
  console.log('Resetting database!');
  const seedDatabase = async () => {
    await Author.deleteMany();
    await Book.deleteMany();

    const tolkien = new Author({ name: 'J.R.R. Tolkien' });
    await tolkien.save();

    const rowling = new Author({ name: 'J.K. Rowling' });
    await rowling.save();

    await new Book({
      bookID: 1,
      title: 'The Hobbit',
      authors: tolkien
    }).save();

    await new Book({
      bookID: 2,
      title: 'The Fellowship of the Ring',
      authors: tolkien
    }).save();

    await new Book({
      bookID: 3,
      title: "Harry Potter and the Philosopher's Stone",
      authors: rowling
    }).save();
  };
  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// const Animal = mongoose.model('animals', {
//   name: String,
//   age: Number,
//   isCute: Boolean
// });

// const harry = new Animal({ name: 'Harry', age: 3, isCute: false }).save();
// const luna = new Animal({ name: 'Luna', age: 2, isCute: true }).save();
// const draco = new Animal({ name: 'Draco', age: 4, isCute: false }).save();

console.log('Connection url =>', process.env.MONGO_URL);
// Start defining your routes here
app.get('/', (req, res) => {
  // Animal.find().then((animals) => {
  //   res.json(animals);
  // });
});

app.get('/authors', async (req, res) => {
  const authors = await Author.find();
  res.json(authors);
});

app.get('/authors/:id', async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (author) {
    res.json(author);
  } else {
    res.status(404).json({ error: 'Author not found' });
  }
});

app.get('/authors/:id/books', async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (author) {
    const books = await Book.find({
      authors: mongoose.Types.ObjectId(author.id)
    });
    res.json(books);
  } else {
    res.status(404).json({ error: 'Books by author not found' });
  }
});

app.get('/books', async (req, res) => {
  const books = await Book.find().populate('authors');
  res.json(books);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
