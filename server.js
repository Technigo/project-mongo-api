import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import bookData from './data/books.json';

// Allowing for us to connect to mongodb database
// Line 10 url to database which we can use in mongodb to access the server data
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Creating the model/structure of each of the instances that will be entered into the database. This model is based on the object structure/keys/values defined for the array elements in the books.json data set. We write the key name and the value type of each of the object keys as defined in the books.json.
const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: String,
  isbn13: String,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});

/* Seeding database: 
1. Seeding database means that the data defined in the function is sent to our database when the database is first started.
2. Mongoose async/await operations is being used to wait for the operation deleteMany to finish before it goes on to re-populate the database with the array of books. 
3. Creating a new instance based on the Books mongoose model above and the books.json array of data which is being iterated over and saved to the mongoDB database.
4. If statement will be true if I have entered the environment variable RESET_DB and equalled it to true when doing npm run dev in the terminal. This will signify that I want the database to be re-run and that the seeding of the database will begin!
*/
if(process.env.RESET_DB) {
  const seedDatabase = async () => {
  // deleteMany will allow for the data that was stored on the database on the last get request to be deleted so that there are no dupications of data. Then the new Authors will be created again.
    await Book.deleteMany({});
  
    bookData.forEach((bookData) => {
      new Book(bookData).save();
    })
  };
  
  seedDatabase();
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// First endpoint that will return the whole array of books data
// Async and await are being used as find is asyncronous and might take some time to return the data being fetched from the server.
app.get('/books', async (request, response) => {
  const {author, title, language, averagerating } = request.query;

  // RegExp is a regular expression object that is used to match the author string/text added to the query parameter with a pattern. 
  if(author) {
    const authorRegexp = new RegExp(author, "i");
    const queryAuthor = await Book.find({authors: authorRegexp});
    if(queryAuthor.length === 0){
      return response.status(404).json({ error: "Sorry that we don't have any data for that author"});
    }
    return response.json(queryAuthor);    
  }

  if(title) {
    const titleRegexp = new RegExp(title, "i");
    const queryTitle = await Book.find({title: titleRegexp});
    if(queryTitle.length === 0){
      return response.status(404).json({ error: "Sorry that we don't have any data for that title"});
    }
    return response.json(queryTitle);    
  }

  if(language) {
    const langRegexp = new RegExp(language, "i");
    const queryLanguage = await Book.find({language_code: langRegexp});
    if(queryLanguage.length === 0){
      return response.status(404).json({ error: "Sorry that we don't have any data for that language"});
    }
    return response.json(queryLanguage);    
  }

  if(averagerating) {
    const queryAveRat = await Book.find({average_rating: averagerating});
    if(queryAveRat.length === 0){
      return response.status(404).json({ error: "Sorry that we don't have any data for that average rating"});
    }
    return response.json(queryAveRat);    
  }

  const books = await Book.find();
  response.json(books);
})

// Second endpoint where the user can write a bookID and a specific book will be returned.
app.get('/books/:id', async (request, response) => {
  const specificBook = await Book.findOne({bookID: request.params.id});

  if(specificBook) {
    response.json(specificBook);
  } else {
    response.status(404).json({ error: "Sorry that we don't have any data for that book"}); 
  }  
})

// Created an object outlining the documentation. Can be found on the start page of the api url
const documentation = {
  "Welcome": "Welcome to Claire's book API 🌼",
  "Endpoint 1": {
    "https://clairebookapi.herokuapp.com/books": "Returns the entire books array",

    "https://clairebookapi.herokuapp.com/books?author=choose": "Returns books by a specific author using the author query string parameter. It will return an array with one or more elements, if the author isn't valid then you will get an error message.",

    "https://clairebookapi.herokuapp.com/books?title=choose": "Use this endpoint to return books with a specific title using the title query string parameter. It will return an array with one or more elements, if the author isn't valid then you'll get an error message.",

    "https://clairebookapi.herokuapp.com/books?language=choose":  "Use this endpoint to return books written in a specific language using the title query string parameter. It will return an array with one or more elements. The following languages are valid: eng, en-GB, en-US, spa, fre, ger, ara, por, grc, mul. If the language isn't valid then you'll get an error message.",
    
    "https://clairebookapi.herokuapp.com/books?averagerating=choose": "Use this endpoint to return books with a specific average rating using the averagerating query string parameter. It will return an array with one or more elements. If the average rating isn't found you'll get an error message.",
  },
  
  "Endpoint 2": {
    "https://books-deployment.herokuapp.com/books/enterbookidnumber": " Use this endpoint to return books with a specific id and replace :id with a number.",
  },
};

  /* --- Third endpoint --
Path for my api documentation to be found which is the homepage of the url
*/
app.get('/documentation', (request, response) => {
  response.json(documentation);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
});
