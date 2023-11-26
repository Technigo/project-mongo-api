import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
 import dotenv from "dotenv";

 dotenv.config();

console.log(process.env);

 mongoose.set("strictQuery", false);
 
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/MongoProject";
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
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

//import and define the schema

const Book = mongoose.model("Book",
{
  bookID: Number,
  title: String,
  author: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});

//Reset the database
/*if (process.env.RESET_DB) {
  console.log("Resetting database");

  const seedDatabase = async () => {
    await Book.deleteMany();
    booksData.forEach((book) => {
      new Book(book).save();
    });
  };

  seedDatabase();
}*/

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  res.json(endpoints);
});

app.get("/books", async (req, res) => {
  try {
      const books = await Book.find();
      res.json(books);
  } catch (error) {
    console.log(error)
  };
  
});


app.get("/books/:id", async (req, res) => {
  const bookID = req.params.id;
  Book.find({ bookID: bookID }).then((bookID) => {
    if (bookID) {
      res.json(bookID);
    } else {
      res.status(404).json({ error: `Book not found` });
    }
  });
});

app.get("/books/rating/:rating", async (req, res) => {
  const bookRating = req.params.rating;
  Book.find({ average_rating: bookRating }).then((average_rating) => {
    if (average_rating) {
      res.json(average_rating);
    } else {
      res.status(404).json({ error: `Book not found` });
    }
  });
});




// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
