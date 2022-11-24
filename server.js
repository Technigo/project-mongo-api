import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo ";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//mongodb://localhost/project-mongo  

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


// RESET_DB=true npm run dev for MongoCompass
if(process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Book.deleteMany();
    booksData.forEach(singleBook => {
      const newBook = new Book(singleBook);
      newBook.save();
    })
  }
  resetDataBase();
}

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

//Routes
app.get("/", (req, res) => {
  const navigation = {
    guide: "These are the routes for this book API!",
    Endpoints: [
      {
        "/bookData": "Display all books",
        "/bookData/authors/:authors": "Search for specific author,  like /authors/Douglas Adams", 
        "/bookData/title/:title": "Search for a title", 
        "/bookData/average_rating/": "Average rating of books - high to low"
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
  const { average_rating } = req.params;
  const bookRating = booksData.sort((a, b) => b.average_rating - a.average_rating)
    res.json(bookRating.slice(0, [-1])) 
})

app.get("/bookData/title/:title", async (req, res) => {
  const { title } = req.params

  try {
    const bookTitle = await Book.findOne({
      title : new RegExp(title)
    })

    if (bookTitle) {
      res.status(200).json({
        success: true,
        results: bookTitle,
      })
    } else {
      res.status(404).json({
        success: false,
        status_code: 404,
        message: `Sorry, we don't carry a book by this title: ${title} (* Hint * I'm sensitive!)`
      })
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request",
    })
  }
})


app.get("/bookData/authors/:authors", async (req, res) => {
  const { authors } = req.params

  try {
    const authorByName = await Book.findOne({
      authors : new RegExp(authors)
    })

    if (authorByName) {
      res.status(200).json({
        success: true,
        results: authorByName,
      })
    } else {
      res.status(404).json({
        success: false,
        status_code: 404,
        message: `Sorry, we could not find any book by ${authors}`
      })
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request",
    })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
