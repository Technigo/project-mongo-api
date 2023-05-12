import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv'

const { Schema } = mongoose;
dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-mongo"
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

/////////////////SCHEMA AND MODEL//////////////////////////
const bookSchema = new Schema({
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number, //original input was 4.38, don't know if I have to define this as a number with decimals, do you have to? hmm....
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number

}) //this is the schema of the book 

const Book = mongoose.model("Book", bookSchema);
//Book is a model that represents a collection of documents. It is a way to interact with the "books" collection. It can be used for CRUD. 

/////////////// RESET/SEED DATABASE USING ENVIRONMENTAL VARIABLE //////////////
if (process.env.RESET_DB) {
  // if the environmental variable RESET_DB is used it resets the database to contain the data that is in the booksData (books.json).
  console.log('Resetting database!')
  // we have a consle log that tells us what's happening 
	const seedDatabase = async () => {
    // the seedDatabase is started and also has async, which tells it to wait for some processes to be finished.
    await Book.deleteMany({})
    //awaut tells the function seedDatabase to wait for the deletion of all books in the database (using the mongoose function deleteMany). The empty object passed to deleteMany is a filter object, it will match ALL documents in the collection. 
  }

  seedDatabase()
  //The function is invoked.
}


//////////////ROUTES//////////////////////
// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello this is my books database!!");
});


app.get("/books", async (req, res) => {
  const {title, authors} = req.query;
  // we define that we can search for title and authors, seperately or combined. 
  const response = {
    success: true, 
    body: {} // body is an empty object that will hold the response data.
  }
  // response is an object that we use to hold the response data that we want to send back to the client in the endpoint /books. 

  const authorsRegex = new RegExp(authors, "i")
  const titleRegex = new RegExp(title, "i");
  // We create new objects of the searchwords that we enter using Regex. We also add the "i" flag. The "i" flag tells the regular expression to ignore case when matching the search pattern. This makes us not have to write the searches with a big letter in the beginning example: we don't have to write "Robert" we can just write "robert"

  try{
    response.body = await Book.find({authors: authorsRegex, title: titleRegex})
    //the body in the response object becomes the result of the search using the find-method.
    if (response.body.length > 0){
      //if the body in the response-object is longer than 0 we display it and also use the status 200 = success
      res.status(200).json(response)
    } else {
      res.status(404).json({
        // is we don't find what we're looking for we display this.
        success: false, 
        body: {
          message: "Book not found"
        }
      })
    }
  } catch(e) {
    //we have this catch here as well in case the server is down, but we first do the search in the try-statement above.
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
  
})

app.get("/books/id/:id", async (req, res) => {
  //This route searcher for the id of the book. OBS! The id is not the same as the bookID as is in the JSON but the _id that is created in the Mongo Compass.
  try {
    ////singleBook is the book that matches the id in the search using the findOne method. The id is the request parameters.
    const singleBook = await Book.findById(req.params.id);
    if (singleBook) {
      //if we find the correct book, we display it. 
      res.status(200).json({
        success: true,
        body: singleBook
      })
    } else {
      //if we don't find the correct book, we display this message
      res.status(404).json({
        success: false,
        body: {
          message: "Book not found. Did you enter the correct id?"
        }
      })
    }
  } catch(e) {
    //this catch is for when the server is down. The search above is wrapped in a try-statement. 
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});

app.get("/books/isbn/:isbn", async (req, res) => {
  //With this route you can search for books using the ISBN
  // We wrap the search in a try catch. We TRY do do the search and if the server is down, the error message in the catch will be displayed. That way we can indicate to the user if the search went wrong or if there is a bigger server error. 
  try {
    const book = await Book.findOne ({isbn: req.params.isbn});
    //book is the book that matches the isbn in the search using the findOne method. The isbn is  the request parameters.
    if (book) {
      // If the specific book with the match isbn exists, it will be displayed.
      res.status(200).json({
        success: true, 
        body: book
      })
    } else {
      // If the book does not exist, this message will be displayed
      res.status(404).json({
        success: false, 
        body:{
          message: "Book not found. Did you enter the correct ISBN?"
        }
      })
    }
  } catch(e) {
    //This is a catch that displays an error message if the server is down (using the code 500)
    res.status(500).json({
      success: false, 
      body: {
        message: e
      }
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
