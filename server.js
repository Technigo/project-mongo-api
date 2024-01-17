import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
import router from "./routes/netflixRoutes";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/netflixtitles";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

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
app.use("/netflix-titles", router);

// Seed the Database
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    try {
      await NetflixTitle.deleteMany({});
      const data = require("./data/netflix-titles.json");
      await NetflixTitle.insertMany(data);
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  };

  seedDatabase();
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
