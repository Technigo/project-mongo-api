// Import necessary modules and set up the Express app
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';
import dotenv from 'dotenv';
import seedDatabase from './db/seedDatabase.js';
import errorHandler from './middleware/errorHandler.js';
import birdRoutes from './routes/birdRoutes.js';
import familyRoutes from './routes/familyRoutes.js';
import habitatRoutes from './routes/habitatRoutes.js';
import dietRoutes from './routes/dietRoutes.js';

dotenv.config();
mongoose.set('strictQuery', false);

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost/birds';

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Reset database if needed
if (process.env.RESET_DATABASE) {
  console.log('Resetting database!');
  seedDatabase();
}

// Use middleware
app.use(errorHandler);

// Set up routes
app.use('/birds', birdRoutes);
app.use('/families', familyRoutes);
app.use('/habitat', habitatRoutes);
app.use('/diet', dietRoutes);

// New endpoint to list all endpoints
app.get('/', (req, res) => {
  const endpoints = listEndpoints(app);
  res.json({ endpoints });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
