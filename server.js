import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import goldenGlobesData from './data/golden-globes.json';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/nominations';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Nominee = mongoose.model('Nominee', {
  nominee: {
    type: String,
  },
  ceremony: {
    type: Number,
  },
  category: {
    type: String,
  },
  year_award: {
    type: Number,
  },
  win: {
    type: Boolean,
  },
});

if (process.env.RESET_DATABASE) {
  console.log('Resetting database!');
  const seedDatabase = async () => {
    await Nominee.deleteMany();

    goldenGlobesData.forEach((nominationsData) => {
      new Nominee(nominationsData).save();
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

// Shows a list of all the winners a certain year
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

// Shows the winner of a certain category from a specific ceremony
// example:/winner/ceremonies/68/categories/best motion picture - drama
app.get(
  '/winner/ceremonies/:ceremony/categories/:category',
  async (req, res) => {
    const ceremony = req.params.ceremony;
    const nominees = await Nominee.find();
    const certainYear = nominees.filter((item) => item.ceremony === +ceremony);
    const category = req.params.category;
    const findNominees = certainYear.filter((item) =>
      item.category.toLowerCase().includes(category.toLowerCase())
    );
    const winner = findNominees.filter((item) => item.win);
    if (winner.length > 0) {
      res.json(winner);
    } else {
      res
        .status(404)
        .json({ error: 'Result not found for this category or year' });
    }
  }
);

// All nominations ever of a certain nominee
// with ie GET "/nominees?query=joaquin"
app.get('/nominees', async (req, res) => {
  const { query } = req.query;
  const queryRegex = new RegExp(query, 'i');
  const foundNominee = await Nominee.find({ nominee: queryRegex });
  if (foundNominee.length > 0) {
    res.json(foundNominee);
  } else {
    res.status(404).json({ error: 'Nominee not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
