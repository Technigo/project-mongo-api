// Importing necessary modules and data from json-file
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';
import exercisesData from './data/exercises.json';

// Creating URL to connect with MongoDB
mongoose.set('strictQuery', false);
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/exerciseAPI';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defined a schema corresponding to the data in the json-file
const Exercise = mongoose.model('Exercise', {
  name: { type: String, required: true },
  force: String,
  level: String,
  mechanic: String,
  equipment: String,
  primaryMuscles: [String],
  secondaryMuscles: [String],
  instructions: [String],
  category: String,
});

// Seed the database with initial data if RESET_DB environment variable is set
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Exercise.deleteMany(); // Clear the existing entries

    exercisesData.exercises.forEach(async (exerciseItem) => {
      const newExercise = new Exercise(exerciseItem); // Creates new Exercise document for each item
      await newExercise.save(); // Saves the new document in the database
    });
  };

  seedDatabase();
}

// Seting up Express app and middleware
const port = process.env.PORT || 9000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Define and list all API endpoints
app.get('/', (req, res) => {
  res.send(listEndpoints(app));
});

// Fetch exercises with optional pagination and filtering by level
app.get('/exercises', async (req, res) => {
  const { page = 1, limit = 10, level } = req.query;
  const skipIndex = (page - 1) * limit;
  try {
    const query = level ? { level: level } : {}; // Filter by level if provided
    const exercises = await Exercise.find(query).skip(skipIndex).limit(Number(limit)).exec();
    res.json(exercises);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request', details: error.message }); // Shows error message if the request failed
  }
});

// Fetch a single exercise by name
app.get('/exercises/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const exercise = await Exercise.findOne({ name: new RegExp(name, 'i') }); // Makes sure the request isn't case sensitive
    if (!exercise) {
      res.status(404).json({ error: 'Exercise not found' }); // Show error if the exercise could not be found
    }
    res.json(exercise);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request', details: error.message });
  }
});

// Using Mongooses aggregate function to group exercises by level and count them
app.get('/exercises/summary/level', async (req, res) => {
  try {
    const summary = await Exercise.aggregate([
      {
        $group: {
          _id: '$level', // Group by level
          count: { $sum: 1 } // Count the number of exercises in each level
        }
      }
    ]);
    res.json(summary); // Return the summary of exercises by level
  } catch (error) {
    res.status(400).json({ error: 'Error fetching exercise summary', details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
