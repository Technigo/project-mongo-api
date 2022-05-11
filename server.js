import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';

// import bookData from "./data/books.json";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

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

const Author = mongoose.model("Author", {
  name: String
});

// if (process.env.RESET_DB) {
// 	const seedDatabase = async () => {
//     await Book.deleteMany();
//     await Author.deleteMany();
// 		bookData.forEach(book => {
//       const newAuthor = new Author({ name: book.authors });
//       newAuthor.save();
//       book.authors = newAuthor;
//       const newBook = new Book(book);
// 			newBook.save();
// 		});
//   };
//   seedDatabase();
// };

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

app.get("/", (req, res) => {
  res.send({
    Welcome: "Hello book lovers! These are the available routes!",
    Routes: ["/authors  get all authors", "/authors/id/:id  get one author by id", "/authors/id/:id/books  get all books by one author", "/books  get all books", "/books/id/:id   get one book by id "],
    Queries: ["/authors?name='name'  get authors whose names contain the string provided", "/authors?id='id'  get one author by id"]
  });
});

app.get("/authors", async (req, res) => {
  const { id, name } = req.query;
  let authors = await Author.find();

  if (id) {
		authors = authors.filter(item => item._id.toString() === id);
	};

  if (name) {
    authors = authors.filter(
      (author) => author.name.toLowerCase().includes(name.toLowerCase())
    )
  };

  if (authors.length > 0) {
    res.json(authors);
  } else {
    res.status(404).json({ error: "Authors not found" })
  } 
});

app.get("/authors/id/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (author) {
      res.json(author)
    } else {
      res.status(404).json({ error: "Author not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid author id" })
  }
});

app.get("/authors/id/:id/books", async (req, res) => {
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

app.get("/books/id/:id", async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
