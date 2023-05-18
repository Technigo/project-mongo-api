import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";
import gotQuotesData from "./data/got-quotes.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndPoints = require('express-list-endpoints');

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const { Schema } = mongoose;

const quoteSchema = new Schema ({
  sentence: String,
  character: {
  name: String,
  slug: String,
  house: {
  name: String,
  slug: String
  }
  }
  })

const Quote = mongoose.model("Quote", quoteSchema);

if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Quote.deleteMany();
    topMusicData.forEach((singleQuote) => {
      const newQuote = new Quote(singleQuote);
      newQuote.save()
    })
  }
  resetDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  Quote.find({}, (err, quotes) => {
    if (err) {
      res.status(500).json({ error: 'An error occurred while retrieving quotes' });
    } else {
      res.json(quotes);
    }
  });
});

app.get('/character/:name', (req, res) => {
  const name = req.params.name;
  Quote.find({ 'character.slug': name }, (err, quotes) => {
    if (err) {
      res.status(500).json({ error: 'An error occurred while retrieving quotes' });
    } else if (quotes.length === 0) {
      res.status(404).json({ error: `No character found with name "${name}"` });
    } else {
      res.json(quotes);
    }
  });
});

app.get('/house/:house', (req, res) => {
  const house = req.params.house;
  const showName = req.query.name;

  let query = { 'character.house.slug': house };
  if (showName) {
    query['character.slug'] = showName;
  }

  Quote.find(query, (err, quotes) => {
    if (err) {
      res.status(500).json({ error: 'An error occurred while retrieving quotes' });
    } else {
      res.json(quotes);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
