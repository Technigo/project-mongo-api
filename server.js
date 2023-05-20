import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import titlesData from "./data/titles.json";
// import goldenGlobesData from "./data/golden-globes.json";
import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('strictQuery', false);
mongoose.Promise = Promise;

const { Schema } = mongoose;

const Title = mongoose.model('Title', {
  title: String,
  director: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Director'
  }
})

const Director = mongoose.model('Director', {
  name: String,
  title: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Title'
  }
})

const dataSchema = new Schema({
  id: Number, 
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
});

const Data = mongoose.model("Data", dataSchema)

if (process.env.RESET_DB) { 
  const resetDatabase = async () => {
    await Data.deleteMany();
    netflixData.forEach = ((singleData) => {
      const newData = new Data(singleData);
      newData.save()
    })
  }
 resetDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.json(listEndpoints(app));
});

// https://project-mongo-api-kpnlmcrmoq-lz.a.run.app/titles
// http://localhost:8080/titles
// Route to get all titles
app.get('/titles', async (req, res) => {
  const titles = await Title.find().populate('director');
  res.json(titles)
});

// https://project-mongo-api-kpnlmcrmoq-lz.a.run.app/titles/645cd880f1686cd98b080ddd
// http://localhost:8080/titles/645cd880f1686cd98b080ddd
// Route to get a single title by ID
app.get('/titles/:id', async (req, res) => {
  try {
  const title = await Title.findById(req.params.id).populate('director'); 
  if (title) {
    res.json(title)
  } else {
    res.status(404).json({ error: 'Title not found '});
  }
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Server error' })
}
});

// https://project-mongo-api-kpnlmcrmoq-lz.a.run.app/directors
// http://localhost:8080/directors
// Route to get all directors 
app.get('/directors', async (req, res) => {
  const directors = await Director.find()
  res.json(directors)
})

// https://project-mongo-api-kpnlmcrmoq-lz.a.run.app/645cde94f1686cd98b081343
// http://localhost:8080/directors/ + director id
// e.g. http://localhost:8080/directors/645cde94f1686cd98b081343
// Route to get a single director by ID
app.get('/directors/:id', async (req, res, next) => {
  try {
  const director = await Director.findById(req.params.id)
  if (director) {
    res.json(director)
  } else {
    req.message = 'Director not found';
    next();
  }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware function to handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ error: req.message || 'Not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});