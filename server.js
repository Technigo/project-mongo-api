import express, { query } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import bookData from './data/books.json';

// Allowing for us to connect to mongodb database
// Line 10 url to database which we can use in mongodb to access the server data
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Creating the model/structure of the database and what data will be stored there for each array element. This model is based on the books.json data set, but it can be based on any kind of data set. Can be string, number and boolean written as values, but which one it is depends on what the properties of the keys are written as in the initial data set.
// Changed bookID in the data set to _id so then I could query using findById() to find a specific id of a book
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
Means that this data is sent to our database when it's first started.
Mongoose async/await operations - helping with asynchronous handling?
Creating a new author based on the mongoose model above.
Then saving this to the mongodb database
*/
const seedDatabase = async () => {
// deleteMany will allow for the data that was stored on the database on the last get request to be deleted so that there are no dupications of data. Then the new Authors will be created again.
  await Book.deleteMany({});

  bookData.forEach((bookData) => {
    new Book(bookData).save();
  })
};

seedDatabase();

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Welcome message when you enter the url
app.get('/', (request, response) => {
  res.json("Welcome to Claire's book API 🌼 For documentation go to https://books-deployment.herokuapp.com/documentation");
});

// First endpoint that will return the whole array of books data
// Async and await are being used as find is asyncronous and might take some time to return the data being fetched from the server?
app.get('/books', async (request, response) => {
  const {author, title, language, averagerating } = request.query;

  // RegExp is a regular expression object that is used to match the author string/text added to the query parameter with a pattern. 
  if(author) {
    const authorRegexp = new RegExp(author);
    const queryAuthor = await Book.find({authors: authorRegexp});
    if(queryAuthor.length === 0){
      return response.status(404).json({ error: "Sorry that we don't have any data for that author"});
    }
    return response.json(queryAuthor);    
  }

  if(title) {
    const titleRegexp = new RegExp(title);
    const queryTitle = await Book.find({title: titleRegexp});
    if(queryTitle.length === 0){
      return response.status(404).json({ error: "Sorry that we don't have any data for that title"});
    }
    return response.json(queryTitle);    
  }

  if(language) {
    const langRegexp = new RegExp(language);
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
});
