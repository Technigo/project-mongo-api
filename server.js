import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import router from './routes';
import errorHandler from './controllers/errorController';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/ufo-sightings';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
// Add router module
app.use('/', router);
app.use(errorHandler);
// Start the server
app.listen(port, () => {});
