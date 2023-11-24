import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { bookModel } from "./models/schema.js";
import { routes } from "../routes/Routes.js";

dotenv.config();

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

mongoose.set("strictQuery", false);

const mongoUrl =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-mongo-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

app.use("/", routes);

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await bookModel.deleteMany({});
    data.forEach((data) => {
      new bookModel(data).save();
    });
  };

  seedDatabase();
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
