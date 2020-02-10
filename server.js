import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errors } from 'celebrate';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from 'morgan';
import compression from 'compression';
import Routes from './routes/index';
import Show from './models/show';
import netflixData from './data/netflix-titles.json';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/netflix';

try {
  mongoose.connect(mongoUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
} catch (error) {
  console.log(error);
}

mongoose.Promise = Promise;

if (process.env.RESET_DB === 'true') {
  const seedDatabase = async () => {
    await Show.deleteMany();

    netflixData.forEach(item => {
      const newShow = new Show(item);
      newShow.save();
    });
  };
  seedDatabase();
  console.log('Database cleared and seeded with new data!');
}

const port = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(compression());
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Middleware that will check if API service is available
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({
      error: 'Service unavailable'
    });
  }
});

// Load API routes
app.use('/api', Routes);

// Catch errors thrown by Celebrate
app.use(errors());

// app.use((req, res, next) => {
//   res.status(404).send("Sorry can't find that!");
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
