import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start


// const User = mongoose.model("User", {
//   name: String,
//   age: Number,
//   deceased: Boolean
// });

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
  text_reviews_count: Number
});

// clears the database and renders new book
// RESET_DB=true npm run dev for MongoCompass
if(process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Book.deleteMany();
    booksData.forEach(singleBook => {
      const newBook = new Book(singleBook);
      newBook.save();
    })
   //  await User.deleteMany();
    // const testUser = new User({name: "Cecilia", age: 27, deceased: false}); 
    // testUser.save(); 
  }
  resetDataBase();  //reset database should be inside an if, to not invoke by accident
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  const navigation = {
    guide: "These are the routes for this book API!",
    Endpoints: [
      {
        "/bookData": "Display all books",
        "/bookData/authors/:authors": "Search for a author",
        "/bookData/title/:title": "Search for a title", 
        "/bookData/average_rating/": "Average rating of books - high to low",
        "/bookData/num_pages/": "The book with most number of pages",
      },
    ],
  };
  res.send(navigation);
});

app.get('/bookData', (req, res) => {
  res.status(200).json({
    data: booksData,
    success: true,
  })
  })

 app.get('/bookData/average_rating', async (req, res) => {
  const bookRating = booksData.sort((a, b) => b.average_rating - a.average_rating)
    res.json(bookRating.slice(0, [-1])) 
})

app.get("/bookData/title/:title", async (req, res) => {
  const bookTitle = await Book.findOne({ title: req.params.title });
  if (bookTitle) { 
    res.json(bookTitle)
  } else {
    res.status(404).json({ error: 'There are no titles by that name here' })
  }
})

app.get('/bookData/authors/:authors', async (req, res) => {
  const authors = await Book.findOne({ authors: req.params.authors })
  if (authors) { 
    res.json(authors)
  } else {
    res.status(404).json({ error: 'We don´t have any books by that author - did you spell correctly?' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
