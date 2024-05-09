import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import booksData from "./data/books.json";

// connects to the database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/technigo-w14-project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// // this loop will go through the array of authors and continue as long as i is less than the length of the authorList array.
// for (let i = 0; i < authorList.length; i++) {
//   try {
//     // tries to find an author by name in the database
//     const author = await Author.findOne({ name: authorList[i] });
//     // if there is no matching auhtor, a new author will be added to the database
//     if (!author) {
//       author = new Author({ name: authorList[i] });
//       await author.save();
//     }
//     res.status(200).json({ message: "Authors processed successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "An error occurred while processing authors" });
//   }
//   // collecting all unique author IDs and adds it to the authorIds array.
//   authorIds.push(author._id);
// }

// const newBook = new Book({
//   ...book,
//   authors: authorIds,
//   isbn: isbn.id,
//   // fortsätt att skapa dessa för varje relation som du har skapat
// });
// await newBook.save();

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

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    try {
      await Book.deleteMany({});
      await Author.deleteMany({});
      await Language.deleteMany({});

      for (const book of booksData) {
        const authorIds = [];
        const authorList = book.authors.split("-");

        const authorsPromises = authorList.map(async (authorName) => {
          const author = await Author.findOne({ name: authorName }).exec();
          if (!author) {
            const newAuthor = new Author({ name: authorName });
            await newAuthor.save();
            return newAuthor._id;
          }
          return author._id;
        });

        const authorIdsResolved = await Promise.all(authorsPromises);
        authorIds.push(...authorIdsResolved);

        let language = await Language.findOne({ language: book.language_code }).exec();
        if (!language) {
          const newLanguage = new Language({ language: book.language_code });
          await newLanguage.save();
          language = newLanguage;
        }

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
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
