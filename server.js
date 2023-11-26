import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import netflixData from './data/netflix-titles.json';
import fs from 'fs';
import MarkdownIt from 'markdown-it';

// MongoDB connection URL
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';

// Connect to MongoDB using Mongoose
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Define Mongoose model for Netflix titles
const NetflixTitle = mongoose.model('NetflixTitle', {
  show_id: Number,
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String,
});

// Seed the MongoDB database with Netflix data
const seedDatabase = async () => {
  try {
    await NetflixTitle.deleteMany({});
    await NetflixTitle.insertMany(netflixData);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
seedDatabase();

// Set up Express application
const port = process.env.PORT || 8080;
const app = express();

// Enable CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

// Endpoint to serve API documentation
app.get('/', (req, res) => {
  try {
    // Read the content of the API documentation file (api-docs.md)
    const docsContent = fs.readFileSync('api-docs.md', 'utf-8');

    // Convert Markdown to HTML using markdown-it
    const md = new MarkdownIt();
    const htmlContent = md.render(docsContent);

    // Send the HTML content as the API documentation
    res.send(htmlContent);
  } catch (error) {
    console.error('Error reading API documentation:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to get all Netflix titles
app.get('/titles', async (req, res) => {
  try {
        // Fetch all titles from MongoDB
    const titles = await NetflixTitle.find();
    res.json(titles);
  } catch (error) {
    console.error('Error reading from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to get a specific title by ID
app.get('/titles/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // Find a title by show_id in MongoDB
    const title = await NetflixTitle.findOne({ show_id: +id });

    // If no document is found in the database, it throws an error indicating that no title was found.
    if (!title) {
      throw new Error('No title was found, please try again!');
    }
   // If a title is found, it responds with a JSON representation of the title.
    res.json(title);
    // Error handling. 
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).send(error.message);
    } else {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
});

// Route to get titles in a specific category
app.get('/titles/categories/:category', async (req, res) => {
  try {
    const requestedCategory = req.params.category;
    // Find titles with a matching category in MongoDB (case-insensitive)
    const titles = await NetflixTitle.find({ listed_in: new RegExp(`^${requestedCategory}$`, 'i') });

    if (titles.length === 0) {
      throw new Error('Category not found, please try again!');
    } else {
      const mediaTitles = titles.map((media) => media.title);
      res.json({ mediaInCategory: mediaTitles });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).send(error.message);
    } else {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
});


// Route to get titles of a specific type (movie or TV show)
app.get('/titles/types/:type', async (req, res) => {
  try {
    const requestedType = req.params.type;
    // Find titles with a matching type in MongoDB (case-insensitive)
    const titles = await NetflixTitle.find({ type: new RegExp(`^${requestedType}$`, 'i') });

    if (titles.length === 0) {
      throw new Error('That is not an available media type, try movie or tv show please.');
    } else {
      const mediaTitlesType = titles.map((typeOfMedia) => typeOfMedia.title);
      res.json({ movieOrTvshow: mediaTitlesType });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).send(error.message);
    } else {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
});

// Route to get titles from a specific country
app.get('/titles/countries/:country', async (req, res) => {
  try {
    const requestedCountry = req.params.country;
    // Find titles with a matching country in MongoDB (case-insensitive)
    const titles = await NetflixTitle.find({ country: new RegExp(requestedCountry, 'i') });

    if (titles.length === 0) {
      throw new Error('That is not an available country, please try again!');
    } else {
      const mediaTitlesCountry = titles.map((mediaCountry) => mediaCountry.title);
      res.json({ mediaFromCountry: mediaTitlesCountry });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).send(error.message);
    } else {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
