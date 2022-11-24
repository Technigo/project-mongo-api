import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import worldCupData from "./data/world-cup.json";
import listEndpoints from "express-list-endpoints";

async function connectoToDB() {
  const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"; // Si esta definida la url usa this sino lo otro.

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity 
  };

  await mongoose.connect(mongoUrl, options);
  mongoose.Promise = Promise;
}

connectoToDB();

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
    await Cup.deleteMany({})

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
