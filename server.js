import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {router} from "./routes/netflixRoutes";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/netflixtitles";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;
mongoose.set('strictQuery', false);

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// Documentation Endpoint
app.get("/", (req, res) => {
  const endpoints = require("express-list-endpoints");
  res.send(endpoints(app));
});

// Netflix Title Routes
app.use(router);

// Seed the Database
// const seedDatabase = async () => {
//   try {
//     await NetflixTitle.deleteMany({})
//     const data = require("./data/netflix-titles.json");
//     await NetflixTitle.insertMany(data);
//   } catch (error) {
//     console.error("Error deleting documents:", error);
//   }
// };

// seedDatabase();

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
