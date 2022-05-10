import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';

import bookData from "./data/books.json";

dotenv.config();

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

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();


const Book = mongoose.model("Book", {
  bookID: Number,
  title: String,
  authors: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author"
  },
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
});

// const User = mongoose.model("User", {
//   name: String,
//   age: Number,
//   deceased: Boolean
// });

const Author = mongoose.model("Author", {
  name: String
})


// const testUser = new User({name: "Amanda", age: 28, deceased: false});

// testUser.save();

if (process.env.RESET_DB) {
	const seedDatabase = async () => {
    // await User.deleteMany();
    await Book.deleteMany();
		bookData.forEach(book => {
      const newAuthor = new Author({ name: book.authors });
      newAuthor.save();
      book.authors = newAuthor;
      const newBook = new Book(book);
			newBook.save();
		});
  };

  seedDatabase();
}


// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// app.use((req, res, next) => {
//   if (mongoose.connection.readyState === 1) {
//     next();
//   } else {
//     res.status(503).json({ error: "Service unavailable" });
//   }
// })

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" })
    } 
  } catch (error) {
    res.status(400).json({ error: "Invalid book id" })
  }
});

app.get("/authors", async (req, res) => {
  const authors = await Author.find();
  res.json(authors);
});

app.get("/authors/:id", async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (author) {
    res.json(author)
  } else {
    res.status(404).json({ error: "Author not found" })
  }
});

app.get("/authors/:id/books", async (req, res) => {
  const author = await Author.findById(req.params.id);

  if (author) {
    const books = await Book.find({authors: mongoose.Types.ObjectId(author.id)})
    res.json(books)
  } else {
    res.status(404).json({ error: "Author not found" })
  }
});

app.get("/books", async (req, res) => {
  const books = await Book.find().populate("authors");
  res.json(books);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
