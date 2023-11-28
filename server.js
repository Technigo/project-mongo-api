import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import listEndpoints from "express-list-endpoints";
// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
import booksData from "./data/books.json" assert { type: "json" };
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";
mongoose.set("strictQuery", false);

const mongoUrl =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-mongo-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

const Schema = mongoose.Schema;

const bookDataSchema = new Schema({
  bookID: { type: Number },
  title: { type: String },
  authors: { type: String },
  average_rating: { type: Number },
  isbn: { type: Number },
  isbn13: { type: Number },
  language_code: { type: String },
  num_pages: { type: Number },
  ratings_count: { type: Number },
  text_reviews_count: { type: Number },
});

const BookDataModel = mongoose.model("BookData", bookDataSchema);

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    console.log("Resetting database!");

    await BookDataModel.deleteMany({});

    booksData.forEach(async (book) => {
      await new BookDataModel(book).save();
    });
  };
  seedDatabase();
}

app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});

app.get("/books", async (req, res) => {
  try {
    const books = await BookDataModel.find();
    res.json(booksData);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Data not found" });
  }
});

//To find a book by id write: http://localhost:8080/books/2 for example.

app.get("/books/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const specificBook = await BookDataModel.findOne({ bookID: id });

    if (specificBook) {
      res.json(specificBook);
    } else {
      res.status(404).json({ error: "Book not found, try another number" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//To find an author write: http://localhost:8080/books/author/J.K. Rowling for example

app.get("/books/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    const booksByAuthor = await BookDataModel.find({ authors: author });
    if (booksByAuthor.length > 0) {
      res.json(booksByAuthor);
    } else {
      res.status(404).json({ error: "No books found for this author" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching author's books" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
