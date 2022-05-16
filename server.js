import express from "express";
import cors from "cors";
import mongoose from "mongoose";
//import topMusicData from "./data/top-music.json";

import booksData from "./data/books.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Port for running app
// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();



// const User = mongoose.model("User", {
//   name: String,
//   age: Number,
//   deceased: Boolean,
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
    text_reviews_count: Number,

});



//const secondTestUser = new User({name: "Daniel, age: 27, deceased: false"});
//secondTestUser.save():

// const Song = mongoose.model("Song", {
//   id: Number,
//   trackName: String,
//   artistName: String,
//   genre: String,
//   bpm: Number,
//   energy: Number,
//   danceability: Number,
//   loudness: Number,
//   liveness: Number,
//   valence: Number,
//   length: Number,
//   acousticness: Number,
//   speechiness: Number,
//   popularity: Number
// });

// if(process.env.RESET_DB) {
//   const seedDatabase = async () => {
//     await Song.deleteMany();
//     topMusicData.forEach( singleSong => {
//       const newSong = new Song(singleSong);
//       newSong.save();
//     })
//   }
//   seedDatabase();
// }


if(process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany();
    booksData.forEach( singleBook => {
      const newBook = new Book(singleBook);
      newBook.save();
  })
  }
 seedDatabase();
}

// const testUser = new User({name: "Maksy", age: 28, deceased: false});
// testUser.save();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Hello, this is here to show it works!");
});

// Start the server
app.listen(port, () => {
  console.log(`Hello Worlds`);
  console.log(`Showing in terminal: Server running on http://localhost:${port}`);
});
