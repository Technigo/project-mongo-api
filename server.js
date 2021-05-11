import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';

const ticketmaster = require('./Router/ticketmaster.js');

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  return mongoose.connection.readyState === 1 
    ? next() 
    : res.status(503).send({ Error: "No Connection to server" })
}); 

app.use('/', ticketmaster);

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
