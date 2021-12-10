/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'
require('dotenv').config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books"

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then((mongooseObject) => {
  console.log(`connected ${mongooseObject}`)
}, (onreject) => {
  console.log(onreject);
})
mongoose.Promise = Promise

const port = process.env.PORT || 8000
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json(listEndpoints(app));
})

const books = require('./controller');

app.use('/books', books);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
