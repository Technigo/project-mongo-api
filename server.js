import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/books";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Author = mongoose.model('Author', {
  name: String
})

const Book = mongoose.model('Book', {
  title: String,
  author: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Author'
  }
})

if (process.env.RESET_DATABASE) {
  console.log('Resetting database!')

const seedDatabase = async () => {
  await Author.deleteMany()

  const tolkien = new Author({ name: 'J.R.R. Tolkien'})
  await tolkien.save()

  const rowling = new Author({ name: 'J.K. Rowling'})
  await rowling.save()

  await new Book({ title: "Harry Potter and the Philosopher's Stone", author: rowling }).save()
  await new Book({ title: "Harry Potter and the Chamber of Secrets", author: rowling }).save()
  await new Book({ title: "Harry Potter and the Prisoner of Azkaban", author: rowling }).save()
  await new Book({ title: "Harry Potter and the Goblet of Fire", author: rowling }).save()
  await new Book({ title: "Harry Potter and the Order of the Phoenix", author: rowling }).save()
  await new Book({ title: "Harry Potter and the Half-Blood Prince", author: rowling }).save()
  await new Book({ title: "Harry Potter and the Deathly Hallows", author: rowling }).save()
  await new Book({ title: "The Lord of the Rings", author: tolkien }).save()
  await new Book({ title: "The Hobbit", author: tolkien }).save()
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
  res.send("Hello Technigo!");
});

// app.get('/books', (req, res) => {
//   res.json(books);
// });

app.get('/books', async (req, res) => {
  const books = await Book.find().populate('author');
  res.json(books)
});

app.get('/authors', async(req, res) => {
  const authors = await Author.find()
  res.json(authors)
})

// http://localhost:8080/authors/ + author id
// e.g. http://localhost:8080/authors/645a5a0a1a47b3ab0f25a953
app.get('/authors/:id', async (req, res) => {
  const author = await Author.findById(req.params.id)
  if (author) {
    res.json(author)
  } else {
    req.message = 'Author not found';
    next();
  }
})

// http://localhost:8080/authors/645a5a0a1a47b3ab0f25a953/books
app.get('/authors/:id/books', async (req, res) => {
  const author = await Author.findById(req.params.id)
  if (author) {
  const books = await Book.find({ author: mongoose.Types.ObjectId(author.id) })
  res.json(books)
} else {
  req.message = 'Author not found';
  next();
}
})

// Middleware function to handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ error: req.message || 'Not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
