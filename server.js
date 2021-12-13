import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

// database setup.
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/animals';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Animal = mongoose.model('Animal', {
  name: String,
  age: Number,
  isFurry: Boolean,
});
// Den här funktionen deletar först allt som är i the backend för att sedan
// "hard-coded" lägga in dessa tre
Animal.deleteMany().then(() => {
  new Animal({ name: 'Alfons', age: 2, isFurry: true }).save();
  new Animal({ name: 'Moa', age: 5, isFurry: true }).save();
  new Animal({ name: 'Jorid', age: 0, isFurry: false }).save();
});

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/', (req, res) => {
  Animal.find().then((animals) => {
    res.json(animals);
  });
});

// This function creates a new route, and possibility to search for one
// animal. (it is case sensitive). If it os not found there will be an error
// message.
app.get('/:name', (req, res) => {
  Animal.findOne({ name: req.params.name }).then((animal) => {
    if (animal) {
      res.json(animal);
    } else {
      res.status(404).json({ error: 'not found' });
    }
  });
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
