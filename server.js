import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import NetflixData from "./data/netflix-titles.json";
import { RoutesNetflix } from "./routes/RoutesNetflix";
import { ModelNetflix } from "./models/ModelNetflix";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/Netflix";

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
//Connect to mongoDB database
mongoose.Promise = global.Promise;

// if (process.env.RESET_DB) {
const seedDatabase = async () => {
  await ModelNetflix.deleteMany({});
  NetflixData.forEach((title) => {
    new ModelNetflix(title).save();
  });
};
seedDatabase();

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Diego added "Parse URL-encoded data

// Use netflix routes
app.use("/", RoutesNetflix);

// Start defining your routes here
// app.get("/", (req, res) => {
//   res.send("Hello Technigo!");
// });

// app.get("/titles", async (req, res) => {
//   const titles = await title.find();
//   res.json(titles);
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export { app };
