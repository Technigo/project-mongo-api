import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
import goldenGlobesData from './data/golden-globes.json';
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/nominations';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// const Nominations = mongoose.model('Nominations', {
//   year_film: Number,
//   year_award: Number,
//   ceremony: Number,
//   category: String,
//   nominee: String,
//   film: String,
//   win: Boolean,
// });

const Nominee = mongoose.model('Nominee', {
  nominee: String,
  category: {
    type: mongoose.Schema.Types.String,
    ref: 'Category',
  },
  year_award: Number,
  win: Boolean,
});

const Category = mongoose.model('Category', {
  category: String,
  nominee: String,
  nominee: {
    type: mongoose.Schema.Types.String,
    ref: 'Nominee',
  },
  year_award: Number,
  win: Boolean,
});

if (process.env.RESET_DATABASE) {
  console.log('Resetting database!');
  const seedDatabase = async () => {
    // await Nominations.deleteMany();
    await Nominee.deleteMany();
    await Category.deleteMany();

    goldenGlobesData.forEach((nominationsData) => {
      // new Nominations(nominationsData).save();
      new Nominee(nominationsData).save();
      new Category(nominationsData).save();
    });
  };
  seedDatabase();
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world');
});

// app.get('/nominations', async (req, res) => {
//   const nominations = await Nominations.find();
//   res.json(nominations);
// });

// shows all the nominees ever
app.get('/nominees', async (req, res) => {
  const nominees = await Nominee.find();
  res.json(nominees);
});

// Shows a list of all the winners ever -works
app.get('/winners', async (req, res) => {
  const nominee = await Nominee.find();
  const winners = nominee.filter((item) => item.win);
  if (winners) {
    res.json(winners);
  } else {
    res.status(404).json({ error: 'Winners not found' });
  }
});

// Shows a list of all the winners a certain year -works
app.get('/year/:year/winners', async (req, res) => {
  const year = req.params.year;
  const findYear = await Nominee.find();
  const certainYear = findYear.filter((item) => item.year_award === +year);
  const certainYearwinners = certainYear.filter((item) => item.win);
  if (certainYearwinners.length > 0) {
    res.json(certainYearwinners);
  } else {
    res.status(404).json({ error: 'Winners not found' });
  }
});

// Shows all the nominees of a certain category a specific year - works
app.get('/year/:year/categories/:category', async (req, res) => {
  const year = req.params.year;
  const findYear = await Nominee.find();
  const certainYear = findYear.filter((item) => item.year_award === +year);
  const category = req.params.category;
  const findNominees = certainYear.filter((item) =>
    item.category.toLowerCase().includes(category.toLowerCase())
  );
  if (findNominees.length > 0) {
    res.json(findNominees);
  } else {
    res
      .status(404)
      .json({ error: 'Result not found for this category or year' });
  }
});

// All nominations ever of a certain nominee - works
app.get('/nominees/:nominee', async (req, res) => {
  const nominee = req.params.nominee;
  const foundNominee = await Nominee.find({ nominee: nominee });
  if (foundNominee.length > 0) {
    res.json(foundNominee);
  } else {
    res.status(404).json({ error: 'Nominee not found' });
  }
});

app.get('/categories', async (req, res) => {
  res.json(await Category.find().populate('Nominee'));
});

// app.get('/nominees/:nominee', async (req, res) => {
//   const nominee = req.params.nominee;
//   if (nominee) {
//     await Category.find({
//       nominee: mongoose.Types.String(nominee.nominee),
//     });
//     res.json(nominee);
//   } else {
//     res.status(404).json({ error: 'Nominee not found' });
//   }
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
