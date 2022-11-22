import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import worldCupData from "./data/world-cup.json";
import listEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.get("/endpoints", (req, res) => {
  res.send(listEndpoints(app))
});

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hi, World Cup Api!");
});

// Seed the database
const Cup = mongoose.model('Cup', {
  year: Number,
  host: String,
  winner: String,
  second: String,
  third: String,
  fourth: String,
  goals_scored: Number,
  teams: Number,
  games: Number,
  attendance: Number
})

if (process.env.RESET_DB) {
	const seedDatabase = async () => {
    // await Cup.deleteMany({})

		worldCupData.forEach((data) => {
			new Cup(data).save()
		})
  }

  seedDatabase()
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
