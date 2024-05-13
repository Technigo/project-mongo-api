import express from "express";
import expressListEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import booksData from "./data/books.json";

// connects to the database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/technigo-w14-project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const Author = mongoose.model("Author", {
  name: String,
});

const Language = mongoose.model("Language", {
  language: String,
});

const Book = mongoose.model("Book", {
  bookID: Number,
  title: String,
  authors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
  ],
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Language",
  },
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});

// checks if the database should be reset and re-seeded when starting the server, depending on if the environment variable is true or false.
if (process.env.RESET_DB) {
  // the function to delete and and insert new data into the database.
  const seedDatabase = async () => {
    try {
      // ensures that all data is deleted before new data is created, preventing the database to have duplication when new data is inserted.
      await Book.deleteMany({});
      await Author.deleteMany({});
      await Language.deleteMany({});

      // iterates over each book in the book array and ensures that each author has an unique id in the database.
      for (const book of booksData) {
        const authorIds = [];
        // seperates each authors to individual authors when a book as more than one author.
        const authorList = book.authors.split("-");
        //  goes through each author in the authorList and tries to find it in the database. If it can't find the name, it will create a new author and add it to the database.
        const authorsPromises = authorList.map(async (authorName) => {
          const author = await Author.findOne({ name: authorName }).exec();
          if (!author) {
            const newAuthor = new Author({ name: authorName });
            await newAuthor.save();
            return newAuthor._id;
          }
          return author._id;
        });

        // waits for all promises to resolve and then collects all author IDs and push them to the authorIds array.
        const bookAuthorIds = await Promise.all(authorsPromises);
        authorIds.push(...bookAuthorIds);

        // tries to find a language that matches the language_code property if no match is found a new language is created.
        let language = await Language.findOne({ language: book.language_code }).exec();
        if (!language) {
          const newLanguage = new Language({ language: book.language_code });
          await newLanguage.save();
          language = newLanguage;
        }

        // creates a new book with modification to the existing book. The spread operator copies all properties from the existing book and authors and language_code is additional properties.
        const newBook = new Book({
          ...book,
          authors: authorIds,
          language_code: language._id,
        });
        await newBook.save();
      }

      console.log("Database seeded successfully");
    } catch (error) {
      console.error("An error occurred while seeding the database:", error);
    }
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

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

// an endpoint for isbn
app.get(`/isbn/:isbn`, (req, res) => {
  try {
    const isbn = req.params.isbn;
    const isbnNumber = booksData.find((item) => item.isbn === +isbn);
    res.json(isbnNumber);
  } catch (error) {
    res.status(404).send("No book was found, based on your search.");
  }
});

// an endpoint to get all authors
app.get("/authors", async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (error) {
    res.status(404).send("No authors was found, based on your search.");
  }
});

// an endpoint for author search
app.get("/authors/:author", async (req, res) => {
  try {
    const regex = new RegExp(req.params.author, "i"); // i for case insensitive
    const authors = await Author.find({ name: { $regex: regex } });
    res.json(authors);
  } catch (error) {
    res.status(404).send("No author was found, based on your search.");
  }
});

// an endpoint to get all languages
app.get("/languages", async (req, res) => {
  try {
    const languages = await Language.find();
    res.json(languages);
  } catch (error) {
    res.status(404).send("No languages was found, based on your search.");
  }
});

// an endpoint to show all books in a specific language
app.get("/languages/:languageid", async (req, res) => {
  try {
    const language = await Language.findById(req.params.languageid);
    const books = await Book.find({ language_code: mongoose.Types.ObjectId.createFromHexString(language.id) })
      .populate("authors")
      .populate("language_code");
    res.json(books);
  } catch (error) {
    res.status(404).send("No books was found, based on your search.");
  }
});

// an endpoint to show all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find().populate("authors").populate("language_code");
    res.json(books);
  } catch (error) {
    res.status(404).send("No books were found, based on your search.");
  }
});

// an endpoint to show all books from a specific author
app.get("/authors/:authorid/books", async (req, res) => {
  try {
    const author = await Author.findById(req.params.authorid);
    const books = await Book.find({ authors: mongoose.Types.ObjectId.createFromHexString(author.id) });
    res.json(books);
  } catch (error) {
    res.status(404).send("No books was found, based on your search.");
  }
});

// an endpoint for bookpages
app.get(`/bookpages/:bookpages`, (req, res) => {
  try {
    const pages = parseInt(req.params.pages);
    const numberOfPages = booksData.filter((item) => item.num_pages >= pages && item.num_pages < pages + 100);
    res.json(numberOfPages);
  } catch (error) {
    res.status(404).send("No books was found, based on your search.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
