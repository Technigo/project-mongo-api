/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

require('dotenv').config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-database" // name of the database

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log(`database connected`)
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

const books = require('./bookscontroller');

app.use('/books', books);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
