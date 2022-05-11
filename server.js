import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints"
import netflixData from "./data/netflix-titles.json";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const Stream = mongoose.model("Stream", {
  show_id: Number,
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String
})


if(process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Stream.deleteMany()
    netflixData.forEach( singleStream => {
      const NewStream = new Stream(singleStream)
      NewStream.save()
    })
  }
  seedDatabase()
 }

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// When mongoDB is not active
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable" })
  }
})

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

app.get("/streams", async (req, res) => {
  const allStreams = await Stream.find({})
  res.send(allStreams)
})

app.get("/streams/title/:title", async (req, res) => {
  
  const netflixTitle = await Stream.find({title: req.params.title})
  res.send(netflixTitle)

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
