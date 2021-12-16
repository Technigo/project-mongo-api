import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import booksData from "./data/books.json";

// Defines the port the app will run on. Defaults to 8080, but can be overridden when starting the server. For example: PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

//mongoURL is the address of my database in my local machine 
const mongoUrl = process.env.MONGO_URL || "mongodb+srv://FatimaGR:9DGqFaBL84dEPsb@cluster0.jdjjo.mongodb.net/bookApi?retryWrites=true&w=majority";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//Model: Must use camel case / model name must be the same as the variable
const Book = mongoose.model("Book", {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});

// RESET_DB is an environment variableRESET_DB=true npm run dev (I need to type this in the terminal to save the data into the database (to seed the database))
// deleteMany: It's a function from mongoose and it delete all the info we have stored in the database before
// saving it so it does not duplicate and this way, we ensure we don't have anything in the database before we start.
// deleteMany and find() method are asyncrounus, it means these methods take their time so we need to add await in front of them.

// Seedind a database:
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    //this is an asyncrounus function
    await Book.deleteMany({}); //first it does this part

    booksData.forEach((item) => {
      const newBook = new Book(item);
      newBook.save();
    });
  };
  seedDatabase();
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Our own middleware that checks if the database is connected before going to our endpoints
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

// RESTFUL ROUTES

// Endpoint 1: Welcome page
app.get("/", (req, res) => {
  res.send("Welcome World! Type /books to get a list of books!");
});

// Endpoint 2: get all the books with the find method
app.get("/books", async (req, res) => {
  try {
    const allBooks = await Book.find(req.query);

    if (allBooks) {
      res.json({
        response: allBooks,
        success: true,
      });
    } else {
      res.status(404).json({
        response: "Not found, sorry!",
        success: false,
      });
    }
  } catch (err) {
    res.status(404).json({ error: "Wrong path, try again!" });
  }
});

// Endpoint 3: get a specific book based on its id, using param
app.get("/books/id/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const bookById = await Book.findById(id);

    if (bookById) {
      res.json({
        response: bookById,
        success: true,
      });
    } else {
      res.status(404).json({
        response: "No book found with that ID number, sorry!",
        success: false,
      });
    }
  } catch (err) {
    res.status(404).json({ error: "Error, iD is invalid!" });
  }
});

// Endpoint 4: get a specific rating on book
app.get("/books-rating/:rating", async (req, res) => {
  const books = await Book.find({
    average_rating: { $gte: req.params.rating },
  }); //average rating is an object //gte=greater than or equal.

  if (books.length === 0) {
    res.status(404).send("No books with that rating was found");
  } else {
    res.json(books);
  }
});

//----COLLECTION 0F RESULT------//

//Endpoint : query params

app.get("/allBooks", async (req, res) => {
  const { authors, title, language } = req.query;

  // try = bloxk of code to try, try and catch come in pairs
  try {
    const books = await Book.find({
      // Regex or RegExp = regural expression is a pattern of characters
      // RegExp is an object used for matching text with a pattern
      // give possibility to add query params without building a specific endpoint
      // it is works as include and toLowerCase
      // The "i" modifier specifies a case-insenitive match.
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
      authors: new RegExp(authors, "i"),
      title: new RegExp(title, "i"),
    });
    // if array is empty return error
    if (books.length === 0) {
      res.json({
        response: "This array is empty",
        success: true,
      });
    }

    res.json(books);
    // catch statement define a block of code to be executed, if an error occurs in the try block
  } catch (error) {
    res.status(404).json({
      response: "Not found!",
      success: false,
    });
  }
});




// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});

// The code below is the model we created instead of using the json data and that's why doesn't need any looping

// const User = mongoose.model("User", {
//   name: String,
//   age: Number,
// });

// const newUser = new User({
//   name: "Lola",
//   age: 35,
// });

// const newUser2 = new User({
//   name: "Ana",
//   age: 27,
// });

// if (process.env.RESET_DB) {
//   const seedDatabase = async () => {
//     await User.deleteMany({});

//     newUser.save();
//     newUser2.save();
//   };
//   seedDatabase();
// }
