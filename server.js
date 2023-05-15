import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/songs";
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


const { Schema } = mongoose;

const songSchema = new Schema({
    id: Number,
    trackName: String,
    artistName: String,
    genre: String,
    bpm: Number,
    energy: Number,
    danceability: Number,
    loudness: Number,
    liveness: Number,
    valence: Number,
    length: Number,
    acousticness: Number,
    speechiness: Number,
    popularity: Number
})

const Song = mongoose.model("Song", songSchema);


// RESET_DB=true npm run dev for MongoCompass
if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Song.deleteMany({})
   topMusicData.forEach((song) => {
      new Song(song).save()
    })
 }
  resetDatabase()
}

// Start defining your routes here
app.get("/", (req, res) => {
  const navigation = {
    guide: "These are the routes for the music data!",
    Endpoints: [
      {
        "/": "Start Page",
        "/allsongs": "All songs",
        "/songs/id/:id": "Find single song",
        "/authors/:id/books": "All books by single author"
      },
    ],
  };
  res.send(navigation);
});

app.get("/allsongs", async (req, res) => {
  // can only await something in an async
  try {
    const allSongs = await Song.find();
    res.status(200).json({
      success: true,
      body: allSongs
    })
  } catch (e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});

app.get("/allsongs/:style", async (req, res) => {
  try {
    const allSongs = await Song.find({ genre: req.params.style });
    res.status(200).json({
      success: true,
      body: allSongs
    })
  } catch (e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});

app.get("/songs/id/:id", async (req, res) => {
  try {
    const singleSong = await Song.findOne({ id: req.params.id });
    if (singleSong) {
      res.status(200).json({
        success: true,
        body: singleSong
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Song not found"
        }
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    });
  }
});









/* SAVING THIS TO GO OVER WITH MENTOR
const { Schema } = mongoose

const bookSchema = new Schema({
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
})

const Book = mongoose.model('Book', bookSchema)

if (process.env.RESET_DATABASE) {
  console.log('resetting database')

    const resetDatabase = async () => {
      await Book.deleteMany({})
     booksData.forEach((book) => {
        new Book(book).save()
      })
   }
    resetDatabase()



const seedDatabase = async () => {
  await Author.deleteMany()

  const tolkien = new Author ({ name: 'J.R.R. Tolkien' })
  await tolkien.save()

  const rowling = new Author ({ name: 'J.K. Rowling' })
  await rowling.save()

  console.log("Hello Worldsssss")
}
seedDatabase() 
}

app.get("/authors", async (req, res) => {
  const authors = await Book.find(mongoose.Types.authors)
  res.json(authors)
})

app.get("/authors/:id", async (req, res) => {
  const author = await Author.findById(req.params.id)
  if (author) {
    res.json(author)
  } else {
    res.status(404).json({ error: "Author not found" })
  }
  
})

app.get("/authors/:id/books", async (req, res) => {
  const author = await Author.findById(req.params.id)
  if (author) {
    const books = await Book.find({ author: mongoose.Types.ObjectId(author.id) })
    res.json(books)
  } else {
    res.status(404).json({ error: "Author not found" })
  }
  
})

app.get("/books", async (req, res) => {
  const books = await Book.find().populate('author')
  res.json(books)
})



try {
  if (singleSong) {
  res.status(200).json ({
    success: true, 
    message: "Here's the track",
    body: authors
})} else {
  res.status(404).json ({
    success: false,
    message: "Nope",
    body: {}
  })
}
// can only await something in an async
} catch(e) {
res.status(400).json({
  success: false,
  body: {
    message: e
  }
})

} */
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});