import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from "dotenv";
import listEndpoints from 'express-list-endpoints';
import { connectDatabase } from './config/database';

dotenv.config(); // Load environment variables from .env

connectDatabase();  // Connect to MongoDB

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
// PORT=9000 npm start
const port = process.env.PORT || 8070;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());


// Start defining your routes here
app.get('/', (req, res) => {
  //documentation
  //Express List Endpoints
  const endpoints = listEndpoints(app);

  res.send({
    message: "This API returns info of users and trips",
    endpoints: endpoints
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
});
