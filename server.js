import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import expressListEndpoints from 'express-list-endpoints';
import netflixData from './data/netflix-titles.json';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl);
mongoose.set('strictQuery', false);
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

const NetflixTitle = mongoose.model('NetflixTitle', {
  title: String,
  genre: String,
  releaseYear: Number,
  // other properties...
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    try {
      await NetflixTitle.deleteMany({});
      await Promise.all(netflixData.map(titleData => new NetflixTitle(titleData).save()));

      console.log('Database seeded successfully.');
    } catch (error) {
      console.error('Error seeding database:', error.message);
    }
  };

  seedDatabase();
}

app.get('/', (req, res) => {
  res.send('Hello Technigo!');
});

app.get('/netflix-titles', async (req, res) => {
  try {
    const titles = await NetflixTitle.find();
    res.json(titles);
  } catch (error) {
    console.error('Error fetching Netflix titles:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/netflix-titles/:id', async (req, res) => {
  try {
    const title = await NetflixTitle.findById(req.params.id);
    if (!title) {
      return res.status(404).json({ message: 'Title not found' });
    }
    res.json(title);
  } catch (error) {
    console.error('Error fetching Netflix title by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/documentation', (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
